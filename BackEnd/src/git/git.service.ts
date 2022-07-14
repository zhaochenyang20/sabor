import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../projects/entities/proejct.entity';
import { Repository } from 'typeorm';
import { SetGitlabInfoDto } from './dto/set-gitlab-info.dto';
import { GitlabService } from './gitlab.service';
import { MergeRequest } from './entities/mergeRequest.entity';
import { AttachMergeRequestDto } from './dto/attach-merge-request.dto';
import { RequirementsService } from '../projects/requirements.service';
import { FunctionalRequirement } from '../projects/entities/functionalRequirement.entity';
import { Issue } from './entities/issue.entity';

interface MergeRequestInfo {
    iid: number;
    title: string;
    description: string;
    author: {
        username: string;
    };
}

interface IssueInfo {
    iid: number;
    title: string;
    description: string;
    state: string;
    assignee: {
        username: string;
    } | null;
    created_at: string;
    closed_at: string | null;
}

@Injectable()
export class GitService {
    private expireLimit = 3600 * 1000;
    private retryLimit = 5 * 60 * 1000;
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(MergeRequest)
        private readonly mergeRequestRepository: Repository<MergeRequest>,
        @InjectRepository(FunctionalRequirement)
        private readonly functionalRequirementRepository: Repository<FunctionalRequirement>,

        @InjectRepository(Issue)
        private readonly issueRepository: Repository<Issue>,
        private readonly gitlabService: GitlabService,
        private readonly requirementService: RequirementsService,
    ) {}

    /**
     * getGitInfo: getting git info of a project
     * @param projectId number
     * @returns data
     */
    async getGitInfo(projectId: number) {
        const project = await this.projectRepository.findOne({ id: projectId });

        if (!project) {
            throw new NotFoundException('The required project is not found!');
        }

        return {
            hasGitRepo: project.hasGitRepo,
            isGitLab: true,
            detail: project.hasGitRepo
                ? {
                      gitlabUrl: project.gitlabUrl,
                      gitlabProjId: project.gitlabProjId,
                      gitAccessToken: project.gitAccessToken,
                      gitIssueTag: project.gitIssueTag,
                  }
                : {},
        };
    }

    /**
     * setting gitlab info of a project
     * @param projectId: number
     * @param detail: modified info
     * If `url` is empty, then we will do nothing
     */
    async setGitLabInfo(projectId: number, detail: SetGitlabInfoDto) {
        const project = await this.projectRepository.findOne({ id: projectId });

        if (!project) {
            throw new NotFoundException('The required project is not found!');
        }

        // The repo has been changed
        if (
            project.hasGitRepo &&
            (detail.url !== project.gitlabUrl ||
                detail.id !== project.gitlabProjId)
        ) {
            // check whether the project has fetched some MRs,
            // and it also attached with some IRs,
            // then we do not allow to remove easily

            const mergeRequests = await this.mergeRequestRepository.find({
                where: { projectId: project.id },
                relations: ['relatedFunctionalRequirement'],
            });
            if (
                mergeRequests.some((mergeReq) => {
                    return mergeReq.relatedFunctionalRequirement.length > 0;
                })
            ) {
                // Meaning there is some bindings
                return {
                    code: 1,
                    info: 'Some IRs have been attached with MRs, modify git repo will cause data loss, stopping',
                };
            }

            Promise.all([
                this.mergeRequestRepository.delete({ projectId: project.id }),
                this.issueRepository.delete({ projectId: project.id }),
            ])
                .then(() => {
                    Logger.debug('git database cache cleaned');
                })
                .catch((err) => {
                    Logger.debug(err);
                });
        }

        project.hasGitRepo = detail.url === '' ? false : true;
        project.gitlabUrl = detail.url;
        project.gitlabProjId = detail.id;
        project.gitAccessToken = detail.token;
        project.gitIssueTag = detail.issueTag || '';
        project.mergeRequestLastAccess = new Date(0);
        project.issueLastAccess = new Date(0);

        try {
            await this.projectRepository.save(project);
        } catch (err) {
            Logger.log(err);
            throw err;
        }

        if (project.gitlabUrl) {
            // Sync with upstream for first time, like below
            Logger.debug('Init - starting fetch from upstream');
            project.mergeRequestLastAccess = new Date(Date.now());
            project.issueLastAccess = new Date(Date.now());
            await this.projectRepository.save(project);

            try {
                await this.gitlabService.fetchMergeRequests(
                    project.gitlabProjId,
                    project.gitAccessToken,
                    project.gitlabUrl,
                );
            } catch (err) {
                return {
                    code: 2,
                    info: 'Cannot fetch from upstream',
                };
            }

            this.getGetlabMergeRequestsNoCache(project)
                .then(() => {
                    Logger.debug('fetched from upstream');
                })
                .catch(async (err) => {
                    Logger.log(err);
                    project.mergeRequestLastAccess = new Date(
                        Date.now() - (this.expireLimit - this.retryLimit),
                    );
                    await this.projectRepository.save(project);
                });

            this.getGitlabIssueRequestsNoCache(project)
                .then(() => {
                    Logger.debug('issue - fetched from upstream');
                })
                .catch(async (err) => {
                    Logger.log(err);

                    project.issueLastAccess = new Date(
                        Date.now() - this.expireLimit + this.retryLimit,
                    );
                    await this.projectRepository.save(project);
                });
        }

        // make caching at first

        return {
            code: 0,
            info: 'Success',
        };
    }

    /** standardrize all return info of merge request,
     * but need to identify whether to show related SR
     */
    private mergeRequestReturnInfo = (showRelatedFuncReq = false) => {
        return (mergeRequest: MergeRequest) => {
            return {
                id: mergeRequest.mergeRequestId,
                title: mergeRequest.title,
                content: mergeRequest.description,
                assignee: mergeRequest.assignee,
                ...(showRelatedFuncReq &&
                    mergeRequest.relatedFunctionalRequirement && {
                        relatedFunctionalRequirement:
                            mergeRequest.relatedFunctionalRequirement
                                .map((func) => {
                                    return {
                                        id: func.id,
                                        name: func.name,
                                        description: func.description,
                                    };
                                })
                                .sort((x, y) =>
                                    x.name < y.name
                                        ? -1
                                        : Number(x.name > y.name),
                                ),
                    }),
            };
        };
    };

    /**
     * finding info (with SR/Issues) in database
     * creates item if not exist
     * also update title/desc from upstream
     */
    async updateMergeRequestInfoInDataBase(
        projectId: number,
        mergeRequestId: number,
        title: string,
        description: string,
        assignee: string | null,
    ) {
        // Finding mergeRequests in database, also creates it if not exist
        let mergeRequest = await this.mergeRequestRepository.findOne(
            {
                projectId: projectId,
                mergeRequestId: mergeRequestId,
            },
            {
                relations: ['relatedFunctionalRequirement'],
            },
        );

        // create new merge request
        if (!mergeRequest) {
            mergeRequest = this.mergeRequestRepository.create({
                projectId: projectId,
                mergeRequestId: mergeRequestId,
                title: title,
                description: description,
                assignee: assignee,
                relatedFunctionalRequirement: [],
                relatedIssue: [],
            });
        } else {
            mergeRequest.title = title;
            mergeRequest.description = description;
            mergeRequest.assignee = assignee;
        }

        await this.mergeRequestRepository.save(mergeRequest);
        return mergeRequest;
    }

    /** getting Merge Request of Gitlab, without cache */
    async getGetlabMergeRequestsNoCache(project: Project) {
        const res = (await this.gitlabService.fetchAllMergeRequests(
            project.gitlabProjId,
            project.gitAccessToken,
            project.gitlabUrl,
        )) as Array<MergeRequestInfo>;

        return await Promise.all(
            res.map(async (ele) => {
                const mergeRequest =
                    await this.updateMergeRequestInfoInDataBase(
                        project.id,
                        ele.iid,
                        ele.title,
                        ele.description,
                        ele.author && ele.author.username,
                    );
                return this.mergeRequestReturnInfo(true)(mergeRequest);
            }),
        );
    }

    /**
     * getting merge req. depending on type of repo
     * new merge requests will be recorded into database
     */
    async getMergeRequests(projectId: number) {
        const project = await this.projectRepository.findOne({ id: projectId });

        if (!project) {
            throw new NotFoundException('The required project is not found!');
        }

        if (!project.hasGitRepo) {
            return {
                hasGitRepo: false,
                content: [],
            };
        }

        // all results will be returned at the end of the function
        const networkFailed = false;

        // we always use data in the database

        const result = (
            await this.mergeRequestRepository.find({
                where: { projectId: project.id },
                relations: ['relatedFunctionalRequirement'],
                order: { mergeRequestId: 'DESC' },
            })
        ).map(this.mergeRequestReturnInfo(true));

        // if the cache expires, we fetch info from upstream git server
        // and in order not to block the request, we have to delay using Promise
        if (
            Date.now() - project.mergeRequestLastAccess.getTime() >
            this.expireLimit
        ) {
            if (project.gitlabUrl) {
                // first we need to modify LastAccess time, to prevent
                // too many queries causing too many upstream requests
                Logger.debug('MR - starting fetch from upstream');
                project.mergeRequestLastAccess = new Date(Date.now());
                await this.projectRepository.save(project);

                this.getGetlabMergeRequestsNoCache(project)
                    .then(() => {
                        Logger.debug('fetched from upstream');
                    })
                    .catch(async (err) => {
                        // TODO: More detailed error handling is yet to be implement.
                        Logger.log(err);
                        // When failed, we still need to modify LastAccess time,
                        // so it can be retried some time (say, 5 mins) later.

                        // setting to (60 - 5) mins ago, so can refresh 5 mins later
                        project.mergeRequestLastAccess = new Date(
                            Date.now() - (this.expireLimit - this.retryLimit),
                        );
                        await this.projectRepository.save(project);
                    });
            }
        }

        return {
            hasGitRepo: true,
            networkFailed: networkFailed,
            content: result as Array<any>,
        };
    }

    // Issue Section is almost the same logic as MR.

    /** standardize all return info for issue */
    private issueReturnInfo = (issue: Issue) => {
        return {
            id: issue.issueId,
            title: issue.title,
            content: issue.description,
            state: issue.state,
            assignee: issue.assignee,
            createTime: issue.createTime && issue.createTime.getTime(),
            closeTime: issue.closeTime && issue.closeTime.getTime(),
        };
    };

    /**
     * update title/desc/state from upstream into database
     * @returns updated issue info
     */
    async updateIssueInfoInDataBase(
        projectId: number,
        issueId: number,
        title: string,
        description: string,
        state: string,
        assignee: string | null,
        createTime: Date | null,
        closeTime: Date | null,
    ) {
        let issue = await this.issueRepository.findOne({
            projectId: projectId,
            issueId: issueId,
        });

        // create
        if (!issue) {
            issue = this.issueRepository.create({
                projectId: projectId,
                issueId: issueId,
                title: title,
                description: description,
                state: state,
                relatedMergeRequest: [],
                assignee: assignee,
                createTime: createTime,
                closeTime: closeTime,
            });
        } else {
            // update
            issue.title = title;
            issue.description = description;
            issue.state = state;
            issue.assignee = assignee;
            issue.createTime = createTime;
            issue.closeTime = closeTime;
        }
        //Logger.debug(issue.title, issue.createTime || 'gg')

        await this.issueRepository.save(issue);
        return issue;
    }

    /** getting Issue from Gitlab, without cache */
    async getGitlabIssueRequestsNoCache(project: Project) {
        const res = (await this.gitlabService.fetchAllIssues(
            project.gitlabProjId,
            project.gitAccessToken,
            project.gitlabUrl,
            project.gitIssueTag,
        )) as Array<IssueInfo>;

        // Delete info not presented

        const notShownIssue = (
            await this.issueRepository.find({ projectId: project.id })
        ).filter(
            (localIssue) =>
                !res.find(
                    (remoteIssue) => localIssue.issueId === remoteIssue.iid,
                ),
        );

        await this.issueRepository.remove(notShownIssue);

        return await Promise.all(
            res.map(async (ele) => {
                //Logger.debug(ele.title + ele.created_at)
                const issue = await this.updateIssueInfoInDataBase(
                    project.id,
                    ele.iid,
                    ele.title,
                    ele.description,
                    ele.state,
                    ele.assignee ? ele.assignee.username : null,
                    ele.created_at ? new Date(ele.created_at) : null,
                    ele.closed_at ? new Date(ele.closed_at) : null,
                );
                return this.issueReturnInfo(issue);
            }),
        );
    }

    /**
     * getting issue. depending on type of repo
     */
    async getIssues(projectId: number) {
        const project = await this.projectRepository.findOne({ id: projectId });

        if (!project) {
            throw new NotFoundException('The required project is not found!');
        }

        if (!project.hasGitRepo) {
            return {
                hasGitRepo: false,
                content: [],
            };
        }

        // with almost same logic as @getMergeRequest,
        // return and update cache if nessary

        const networkFailed = false;

        const result = (
            await this.issueRepository.find({
                where: { projectId: project.id },
                order: { issueId: 'DESC' },
            })
        ).map(this.issueReturnInfo);

        if (Date.now() - project.issueLastAccess.getTime() > this.expireLimit) {
            if (project.gitlabUrl) {
                Logger.debug('issue - starting fetch from upstream');
                project.issueLastAccess = new Date(Date.now());
                await this.projectRepository.save(project);

                this.getGitlabIssueRequestsNoCache(project)
                    .then(() => {
                        Logger.debug('issue - fetched from upstream');
                    })
                    .catch(async (err) => {
                        // TODO: More detailed error handling is yet to be implement.
                        Logger.log(err);

                        project.issueLastAccess = new Date(
                            Date.now() - this.expireLimit + this.retryLimit,
                        );
                        await this.projectRepository.save(project);
                    });
            }
        }

        return {
            hasGitRepo: true,
            networkFailed: networkFailed,
            content: result as Array<any>,
        };
    }

    /**
     * attach merge request to some functional requests
     * if some data is invalid, just **ignore** it.
     */
    async attachMergeRequestWithFunctionalRequest(
        projectId: number,
        data: AttachMergeRequestDto,
    ) {
        // In order to prevent data race between load
        // and store, we must use process each request one by one.
        if (data.addItem) {
            for (const ele of data.addItem) {
                //Logger.debug(ele.functionalRequestId, ele.mergeRequestId);

                const funcReq =
                    await this.requirementService.validateFunctionalRequest(
                        projectId,
                        ele.functionalRequestId,
                    );
                if (!funcReq) continue;
                const mergeRequest = await this.mergeRequestRepository.findOne(
                    {
                        projectId: projectId,
                        mergeRequestId: ele.mergeRequestId,
                    },
                    { relations: ['relatedFunctionalRequirement'] },
                );
                // Since every item has been stored in the database,
                // so if it does not exist, we can conclude that
                // there isn't such merge request
                if (!mergeRequest) continue;

                if (
                    !mergeRequest.relatedFunctionalRequirement.find((item) => {
                        return item.id === ele.functionalRequestId;
                    })
                ) {
                    mergeRequest.relatedFunctionalRequirement.push(funcReq);
                    await this.mergeRequestRepository.save(mergeRequest);
                }
            }
        } else if (data.delItem) {
            for (const ele of data.delItem) {
                const funcReq =
                    await this.requirementService.validateFunctionalRequest(
                        projectId,
                        ele.functionalRequestId,
                    );
                if (!funcReq) continue;
                const mergeRequest = await this.mergeRequestRepository.findOne(
                    {
                        projectId: projectId,
                        mergeRequestId: ele.mergeRequestId,
                    },
                    { relations: ['relatedFunctionalRequirement'] },
                );
                if (!mergeRequest) continue;

                //Logger.debug(mergeRequest.relatedFunctionalRequirement[0].id);
                //Logger.debug(ele.functionalRequestId);
                mergeRequest.relatedFunctionalRequirement =
                    mergeRequest.relatedFunctionalRequirement.filter(
                        (funcReq) => funcReq.id !== ele.functionalRequestId,
                    );

                //Logger.debug(mergeRequest.relatedFunctionalRequirement.length);
                await this.mergeRequestRepository.save(mergeRequest);
            }
        }

        return 'success';
    }

    /**
     * get MRs associated to certaion functional request(IR).
     */
    async getMergeRequestOfFunctionalRequest(
        projectId: number,
        functionalRequestId: number,
    ) {
        let funcReq = await this.requirementService.validateFunctionalRequest(
            projectId,
            functionalRequestId,
        );
        if (!funcReq) {
            throw new BadRequestException({
                code: 1,
                info: 'the given Functional Request does not belong to this project',
            });
        }

        funcReq = await this.functionalRequirementRepository.findOneOrFail(
            {
                id: functionalRequestId,
            },
            {
                relations: ['relatedMergeRequest'],
            },
        );
        return funcReq.relatedMergeRequest
            .map(this.mergeRequestReturnInfo())
            .sort((x, y) => y.id - x.id);
    }

    /**
     * Get that a certain issue is closed by which MRs
     */
    async getIssueCloseBy(projectId: number, issueId: number) {
        const project = await this.projectRepository.findOne({ id: projectId });

        if (!project) {
            throw new NotFoundException({
                data: 1,
                info: 'The required project is not found!',
            });
        }

        const issue = await this.issueRepository.findOne(
            { projectId: projectId, issueId: issueId },
            { relations: ['relatedMergeRequest'] },
        );

        // Since we do not fetch new issues in this query,
        // we do not accept issues not in the database
        if (!issue) {
            throw new NotFoundException({
                data: 2,
                info: 'The required issue is not found',
            });
        }

        // here we use a different approach than getting whole Issue/MR:
        // we first fetch from upstream, and update database
        // unless error occured or cache did not expire
        // then all things are returned according to database contents
        if (Date.now() - issue.closeByLastAccess.getTime() > this.expireLimit) {
            if (project.gitlabUrl) {
                try {
                    const result = (await this.gitlabService.fetchIssueClosedBy(
                        project.gitlabProjId,
                        project.gitAccessToken,
                        project.gitlabUrl,
                        issueId,
                    )) as Array<MergeRequestInfo>;
                    issue.relatedMergeRequest = await Promise.all(
                        result.map(async (ele) => {
                            return await this.updateMergeRequestInfoInDataBase(
                                projectId,
                                ele.iid,
                                ele.title,
                                ele.description,
                                ele.author && ele.author.username,
                            );
                        }),
                    );
                    issue.closeByLastAccess = new Date(Date.now());
                    Logger.debug('closed-by upstream');
                    await this.issueRepository.save(issue);
                } catch (err) {
                    Logger.log(err);
                }
            }
        }

        //Logger.debug(issue.relatedMergeRequest.length);
        return issue.relatedMergeRequest
            .map(this.mergeRequestReturnInfo())
            .sort((x, y) => y.id - x.id);
    }

    async makeMergeRequestAndFunctionalRequestAttachmentSuggestions(
        projectId: number,
        mergeRequestId: number,
    ) {
        const mergeRequest = await this.mergeRequestRepository.findOne({
            projectId: projectId,
            mergeRequestId: mergeRequestId,
        });
        if (!mergeRequest) {
            throw new NotFoundException('mergeRequest not found!');
        }

        const functionalRequirements =
            await this.functionalRequirementRepository.find({
                where: { projectId: projectId },
                relations: ['relatedMergeRequest'],
            });

        //Logger.debug(mergeRequest.title);
        // First generate validity of the SR (in order to use promise)
        // then filter it
        // use `null` for invalid indication
        const funcReqestAvail = functionalRequirements.map(
            (
                functionalRequirement,
            ): {
                id: number;
                name: string;
                description: string;
            } | null => {
                // not in the project
                // checked by SQL query.
                /*
                if (
                    !(await this.requirementService.validateFunctionalRequest(
                        projectId,
                        functionalRequirement.id,
                    ))
                ) {
                    return null;
                }
                */
                // already binded

                if (
                    functionalRequirement.relatedMergeRequest.find(
                        (ele): boolean => {
                            return ele.mergeRequestId === mergeRequestId;
                        },
                    )
                ) {
                    return null;
                }
                const matchText = functionalRequirement.name;
                //Logger.debug(matchText);

                return mergeRequest.title.includes(matchText) ||
                    mergeRequest.description.includes(matchText)
                    ? {
                          id: functionalRequirement.id,
                          name: functionalRequirement.name,
                          description: functionalRequirement.description,
                      }
                    : null;
            },
        );
        return funcReqestAvail
            .filter((ele) => ele !== null)
            .sort((x, y) => (x.name < y.name ? -1 : Number(x.name > y.name)));
    }

    async getIssueCausedByFuncReq(
        projectId: number,
        functionalRequirementId: number,
    ) {
        const functionalRequirement =
            await this.requirementService.validateFunctionalRequest(
                projectId,
                functionalRequirementId,
            );
        if (!functionalRequirement) {
            throw new NotFoundException('SR not found!');
        }

        const issues = await this.issueRepository.find({
            projectId: projectId,
        });
        const matchText = functionalRequirement.name;

        return issues
            .filter(
                (issue) =>
                    issue.title.includes(matchText) ||
                    issue.description.includes(matchText),
            )
            .map(this.issueReturnInfo)
            .sort((x, y) => y.id - x.id);
    }

    async getRepoIssueStat(projectId: number) {
        const allIssue = await this.issueRepository.find({
            projectId: projectId,
        });

        const issueSplitByAuthor = allIssue.reduce(
            (
                result: { name: string; time: number[]; openIssue: number }[],
                issue,
            ) => {
                if (!issue.assignee) return result;

                // null meaning not closed yet
                const useTime: number | null =
                    !issue.closeTime || !issue.createTime
                        ? null
                        : issue.closeTime.getTime() -
                          issue.createTime.getTime();

                const user = result.find((ele) => ele.name === issue.assignee);
                if (!user) {
                    if (useTime) {
                        result.push({
                            name: issue.assignee,
                            time: [useTime],
                            openIssue: 0,
                        });
                    } else {
                        result.push({
                            name: issue.assignee,
                            time: [],
                            openIssue: 1,
                        });
                    }
                } else {
                    // Take notice that `user` is a reference, so we can directly modify it;
                    if (useTime) {
                        user.time.push(useTime);
                    } else {
                        user.openIssue++;
                    }
                }
                return result;
            },
            [],
        );

        return issueSplitByAuthor;
    }

    async getRepoMergeRequestStat(projectId: number) {
        const allMergeRequests = await this.mergeRequestRepository.find({
            projectId,
        });

        return allMergeRequests.reduce(
            (
                result: { name: string; mergeRequest: number }[],
                mergeRequest,
            ) => {
                if (!mergeRequest.assignee) return result;

                const user = result.find(
                    (ele) => ele.name === mergeRequest.assignee,
                );
                if (user) {
                    user.mergeRequest++;
                } else {
                    result.push({
                        name: mergeRequest.assignee,
                        mergeRequest: 1,
                    });
                }
                return result;
            },
            [],
        );
    }
}

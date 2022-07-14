import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequirementsService } from '../projects/requirements.service';
import {
    createMockRepository,
    mockFunctionalRequirement,
    mockFunctionalRequirementRepository,
    mockProject,
    mockProjectRepository,
    MockRepository,
} from '../mocks/mock-repository';
import { Project } from '../projects/entities/proejct.entity';
import { MergeRequest } from './entities/mergeRequest.entity';
import { GitController } from './git.controller';
import { GitService } from './git.service';
import { GitlabService } from './gitlab.service';
import {
    mockIssue,
    mockIssue2,
    mockIssueRepository,
    mockMergeRequest,
    mockMergeRequest2,
    mockMergeRequestRepository,
} from '../mocks/mock-repository-git';
import { FunctionalRequirement } from '../projects/entities/functionalRequirement.entity';
import { Issue } from './entities/issue.entity';

// We only use part of RequirementService,
// so we just mock it, without importing the whole
// provider
const mockRequirementsService = {
    validateFunctionalRequest: jest
        .fn()
        .mockImplementation(
            (projectId: number, functionalRequestId: number) => {
                if (projectId === 1 && functionalRequestId === 1) {
                    return mockFunctionalRequirement;
                } else {
                    return null;
                }
            },
        ),
};

describe('Git controller', () => {
    let gitController: GitController;
    let projectRepository: MockRepository;
    let mergeRequestRepository: MockRepository;
    let issueRepository: MockRepository;
    let functionalRepository: MockRepository;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [GitController],
            providers: [
                GitlabService,
                GitService,
                {
                    provide: getRepositoryToken(Project),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(MergeRequest),
                    useValue: createMockRepository(),
                },

                {
                    provide: RequirementsService,
                    useValue: mockRequirementsService,
                },
                {
                    provide: getRepositoryToken(FunctionalRequirement),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(Issue),
                    useValue: createMockRepository(),
                },
            ],
        }).compile();

        gitController = app.get<GitController>(GitController);
        projectRepository = app.get<MockRepository>(
            getRepositoryToken(Project),
        );
        mergeRequestRepository = app.get<MockRepository>(
            getRepositoryToken(MergeRequest),
        );
        mockProjectRepository(projectRepository);
        mockMergeRequestRepository(mergeRequestRepository);
        (functionalRepository = app.get<MockRepository>(
            getRepositoryToken(FunctionalRequirement),
        )),
            mockFunctionalRequirementRepository(functionalRepository);
        issueRepository = app.get<MockRepository>(getRepositoryToken(Issue));
        mockIssueRepository(issueRepository);
    });

    /*
    it('should run smoothly', async () => {
        const res = await gitController.test();
        expect(res).not.toBeFalsy();
    });
    */

    const url = 'https://gitlab.secoder.net';
    const repoId = 492;
    const accessToken = '1ezpEtzHsLRswHaKvvCy';
    describe('get git info', () => {
        it('should fetch empty git info', async () => {
            const res = await gitController.getGitInfo(1);
            expect(res.code).toBe(200);
            expect(res.data).toEqual({
                hasGitRepo: false,
                isGitLab: true,
                detail: {},
            });
        });

        it('should fetch full gitlab info', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject }; // In order to DEEP COPY!!!
                proj.hasGitRepo = true;
                proj.gitlabUrl = url;
                proj.gitlabProjId = repoId;
                proj.gitAccessToken = accessToken;
                proj.gitIssueTag = 'TEST';
                return proj;
            });
            const res = await gitController.getGitInfo(1);
            expect(res.code).toBe(200);
            expect(res.data).toEqual({
                hasGitRepo: true,
                isGitLab: true,
                detail: {
                    gitlabUrl: url,
                    gitlabProjId: repoId,
                    gitAccessToken: accessToken,
                    gitIssueTag: 'TEST',
                },
            });
        });

        it('should throw for non exist projId', async () => {
            await expect(() =>
                gitController.getGitInfo(114514),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('setGitInfo', () => {
        it('should update git info without tag', async () => {
            projectRepository.save.mockClear();

            const res = await gitController.setGitInfo(1, {
                url: url,
                id: repoId,
                token: accessToken,
            });
            expect(res.data.code).toBe(0);
            expect(projectRepository.save).toBeCalledTimes(2);
            expect(projectRepository.save).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    hasGitRepo: true,
                    gitlabUrl: url,
                    gitlabProjId: repoId,
                    gitAccessToken: accessToken,
                    gitIssueTag: '',
                }),
            );
        });

        it('should update git info with tag', async () => {
            projectRepository.save.mockClear();

            const res = await gitController.setGitInfo(1, {
                url: url,
                id: repoId,
                token: accessToken,
                issueTag: 'TEST',
            });
            expect(res.data.code).toBe(0);
            expect(projectRepository.save).toBeCalledTimes(2);
            expect(projectRepository.save).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    hasGitRepo: true,
                    gitlabUrl: url,
                    gitlabProjId: repoId,
                    gitAccessToken: accessToken,
                    gitIssueTag: 'TEST',
                }),
            );
        });

        it('should clear git info with clean MR info', async () => {
            projectRepository.save.mockClear();
            projectRepository.findOne.mockImplementation(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = url;
                proj.gitlabProjId = repoId;
                proj.gitAccessToken = accessToken;
                return proj;
            });
            mergeRequestRepository.find.mockImplementation(() => {
                return [{ ...mockMergeRequest2 }];
            });
            mergeRequestRepository.remove.mockClear();
            issueRepository.delete.mockClear();

            const res = await gitController.setGitInfo(1, {
                url: '',
                id: repoId,
                token: accessToken,
            });
            expect(res.data.code).toBe(0);
            expect(projectRepository.save).toBeCalledTimes(1);
            expect(projectRepository.save).toBeCalledWith(
                expect.objectContaining({
                    hasGitRepo: false,
                    gitlabUrl: '',
                    mergeRequestLastAccess: new Date(0),
                    issueLastAccess: new Date(0),
                }),
            );
        });

        it('should not proceed with MR and IR related', async () => {
            projectRepository.save.mockClear();
            projectRepository.findOne.mockImplementation(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = url;
                proj.gitlabProjId = repoId;
                proj.gitAccessToken = accessToken;
                return proj;
            });
            mergeRequestRepository.find.mockImplementation(() => {
                return [{ ...mockMergeRequest }];
            });

            const res = await gitController.setGitInfo(1, {
                url: url,
                id: repoId + 1,
                token: accessToken,
            });
            expect(res.data.code).toBe(1);
        });

        it('should throw for non exist proj', async () => {
            await expect(() =>
                gitController.setGitInfo(114514, {
                    url: '',
                    id: 0,
                    token: '',
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return warning for network error', async () => {
            const res = await gitController.setGitInfo(1, {
                url: 'www.baidu.com',
                id: 0,
                token: '',
            });
            expect(res.data.code).toBe(2);
        });
    });

    describe('git merge request', () => {
        // The only mode we can test here is it really returns database info,
        // and called fetching when needed
        it('should fetch empty MR info', async () => {
            mockProject.hasGitRepo = false;
            mockProject.gitlabUrl = '';
            const res = await gitController.gitMergeRequest(1);
            expect(res).toEqual({
                code: 200,
                data: {
                    hasGitRepo: false,
                    content: [],
                },
            });
        });

        it('should return database content for cached info', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = 'https://gitlab.secoder.net';
                proj.gitlabProjId = 492;
                proj.gitAccessToken = '1ezpEtzHsLRswHaKvvCy';
                proj.mergeRequestLastAccess = new Date(Date.now());
                return proj;
            });
            mergeRequestRepository.find.mockImplementationOnce(() => {
                return [{ ...mockMergeRequest }];
            });
            mergeRequestRepository.find.mockClear();
            const res = await gitController.gitMergeRequest(1);
            expect(mergeRequestRepository.find).toBeCalledTimes(1);
            expect(res.data.networkFailed).toBe(false);
            expect(res.data.content).toEqual([
                expect.objectContaining({
                    id: mockMergeRequest.mergeRequestId,
                }),
            ]);
        });

        it('should try voking upstream fetch', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = 'https://gitlab.secoder.net';
                proj.gitlabProjId = 492;
                proj.gitAccessToken = '1ezpEtzHsLRswHaKvvCy';
                proj.mergeRequestLastAccess = new Date(0);
                return proj;
            });
            mergeRequestRepository.find.mockClear();
            projectRepository.save.mockClear();
            const res = await gitController.gitMergeRequest(1);
            expect(res.code).toBe(200);
            expect(res.data).toEqual(
                expect.objectContaining({
                    hasGitRepo: true,
                    networkFailed: false,
                }),
            );
            expect(projectRepository.save).toBeCalled();
        });

        it('should throw for non exist proj', async () => {
            await expect(() =>
                gitController.gitMergeRequest(114514),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return empty for network err', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = 'www.baidu.com';
                proj.gitlabProjId = 233;
                proj.gitAccessToken = '';
                proj.mergeRequestLastAccess = new Date(0);
                return proj;
            });
            projectRepository.save.mockClear();
            await gitController.gitMergeRequest(1);
            expect(projectRepository.save).toBeCalled();
        });
    });

    describe('git issue', () => {
        it('should fetch empty issue info', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                return proj;
            });
            const res = await gitController.gitIssue(1);
            expect(res).toEqual({
                code: 200,
                data: {
                    hasGitRepo: false,
                    content: [],
                },
            });
        });

        it('should return database content for cached info', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabProjId = 492;
                proj.gitlabUrl = 'https://gitlab.secoder.net';
                proj.gitAccessToken = '1ezpEtzHsLRswHaKvvCy';
                proj.issueLastAccess = new Date(Date.now());
                return proj;
            });
            issueRepository.find.mockImplementationOnce(() => {
                return [{ ...mockIssue }, { ...mockIssue2 }];
            });
            issueRepository.find.mockClear();
            const res = await gitController.gitIssue(1);

            expect(issueRepository.find).toBeCalledTimes(1);
            expect(res.data.networkFailed).toBe(false);
            expect(res.data.content).toEqual([
                expect.objectContaining({
                    id: mockIssue.issueId,
                }),
                expect.objectContaining({
                    id: mockIssue2.issueId,
                }),
            ]);
        });

        it('should try to fetch upstream', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = 'https://gitlab.secoder.net';
                proj.gitlabProjId = 492;
                proj.gitAccessToken = '1ezpEtzHsLRswHaKvvCy';
                proj.gitIssueTag = 'bug';
                proj.issueLastAccess = new Date(0);
                return proj;
            });
            projectRepository.save.mockClear();
            const res = await gitController.gitIssue(1);
            expect(res.code).toBe(200);
            expect(res.data).toEqual(
                expect.objectContaining({
                    hasGitRepo: true,
                    networkFailed: false,
                }),
            );
            expect(projectRepository.save).toBeCalled();
        });

        it('should throw for non exist proj', async () => {
            await expect(() => gitController.gitIssue(114514)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should return empty for network err', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = 'www.baidu.com';
                proj.gitlabProjId = 233;
                proj.gitAccessToken = '';
                proj.issueLastAccess = new Date(0);
                return proj;
            });

            projectRepository.save.mockClear();
            const res = await gitController.gitIssue(1);
            expect(res.data.content).toEqual([]);
            expect(projectRepository.save).toBeCalled();
        });
    });

    describe('attach merge request with functional requests', () => {
        it('should return normal for normal tests', async () => {
            mockRequirementsService.validateFunctionalRequest.mockClear();

            await gitController.attachMergeRequest(1, {
                addItem: [
                    { functionalRequestId: 1, mergeRequestId: 1 },
                    { functionalRequestId: 2, mergeRequestId: 1 },
                    { functionalRequestId: 1, mergeRequestId: 2 },
                ],
            });

            expect(
                mockRequirementsService.validateFunctionalRequest,
            ).toBeCalledTimes(3);
            expect(mergeRequestRepository.findOne).toBeCalledTimes(2);
            expect(mergeRequestRepository.save).toBeCalledTimes(1);
            expect(mergeRequestRepository.save).toBeCalledWith(
                expect.objectContaining({
                    projectId: 1,
                    mergeRequestId: 2,
                    relatedFunctionalRequirement: [
                        expect.objectContaining({
                            id: 1,
                        }),
                    ],
                }),
            );
        });

        it('should return normal for del', async () => {
            mockRequirementsService.validateFunctionalRequest
                .mockImplementationOnce(() => false)
                .mockImplementationOnce(() => true)
                .mockImplementationOnce(() => true);

            mergeRequestRepository.findOne
                .mockImplementationOnce(() => {
                    return null;
                })
                .mockImplementationOnce(() => {
                    return {
                        relatedFunctionalRequirement: [{ id: 1 }],
                    };
                });

            mockRequirementsService.validateFunctionalRequest.mockClear();

            await gitController.attachMergeRequest(1, {
                delItem: [
                    { functionalRequestId: 1, mergeRequestId: 1 },
                    { functionalRequestId: 2, mergeRequestId: 1 },
                    { functionalRequestId: 1, mergeRequestId: 2 },
                ],
            });

            expect(
                mockRequirementsService.validateFunctionalRequest,
            ).toBeCalledTimes(3);
            expect(mergeRequestRepository.findOne).toBeCalledTimes(2);
            expect(mergeRequestRepository.save).toBeCalledTimes(1);
            expect(mergeRequestRepository.save).toBeCalledWith(
                expect.objectContaining({
                    relatedFunctionalRequirement: [],
                }),
            );
        });
        it('should return ok for empty addItem', async () => {
            await gitController.attachMergeRequest(1, {});
        });
    });

    describe('get merge request of functional request', () => {
        it('should return normal for normal tests', async () => {
            expect(
                await gitController.getMergeRequestOfFunctionalRequest(1, 1),
            ).toEqual({
                code: 200,
                data: [expect.objectContaining({ id: 1 })],
            });
        });

        it('should return fatal for invalid requests', async () => {
            await expect(() =>
                gitController.getMergeRequestOfFunctionalRequest(1, 2),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('issue-closed-by', () => {
        it('should return normal on normal requests', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = 'https://gitlab.secoder.net';
                proj.gitlabProjId = 492;
                proj.gitAccessToken = '1ezpEtzHsLRswHaKvvCy';
                return proj;
            });
            issueRepository.findOne.mockImplementationOnce(
                ({ projectId, issueId }) => {
                    expect(projectId).toBe(1);
                    expect(issueId).toBe(23);
                    const issue = { ...mockIssue };
                    issue.issueId = 23;
                    return issue;
                },
            );

            const res = await gitController.getIssueClosedBy(1, 23);
            expect(res.data.length).toBeGreaterThan(0);
        });

        it('should throw for non-exist project', async () => {
            await expect(
                gitController.getIssueClosedBy(114514, 1),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw for non-exist issue', async () => {
            await expect(
                gitController.getIssueClosedBy(1, 114514),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return empty for wrong URL info', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = 'www.baidu.com';
                proj.gitlabProjId = 233;
                proj.gitAccessToken = '';
                return proj;
            });
            const res = await gitController.getIssueClosedBy(1, 1);
            expect(res.data).toEqual([]);
        });

        it('should return cache', async () => {
            projectRepository.findOne.mockImplementationOnce(() => {
                const proj = { ...mockProject };
                proj.hasGitRepo = true;
                proj.gitlabUrl = 'https://gitlab.secoder.net';
                proj.gitlabProjId = 492;
                proj.gitAccessToken = '1ezpEtzHsLRswHaKvvCy';
                return proj;
            });
            issueRepository.findOne.mockImplementationOnce(
                ({ projectId, issueId }) => {
                    expect(projectId).toBe(1);
                    expect(issueId).toBe(2);
                    const issue = { ...mockIssue2 };
                    issue.closeByLastAccess = new Date(Date.now());
                    return issue;
                },
            );
            const res = await gitController.getIssueClosedBy(1, 2);
            expect(res.data.length).toBe(1);
        });
    });

    describe('make MR suggestions', () => {
        it('should return invalid for non-exist MR', async () => {
            const projectId = 3;
            const mergeRequestId = 2;
            mergeRequestRepository.findOne.mockImplementationOnce(
                ({ projectId: projId, mergeRequestId: mrId }) => {
                    expect(projId).toBe(projectId);
                    expect(mrId).toBe(mergeRequestId);
                    return null;
                },
            );
            await expect(() =>
                gitController.getMergeRequestSuggestion(
                    projectId,
                    mergeRequestId,
                ),
            ).rejects.toThrow(NotFoundException);
        });

        it('should be ok', async () => {
            const projId = 5;
            const mrId = 7;
            mergeRequestRepository.findOne.mockImplementationOnce(
                ({ projectId, mergeRequestId }) => {
                    expect(projectId).toBe(projId);
                    expect(mergeRequestId).toBe(mrId);
                    return {
                        projectId: projId,
                        mergeRequestId: mrId,
                        title: 'FLAG.4, FLAG.5',
                        description: 'FLAG.1, FLAG.2, FLAG.3, ',
                    };
                },
            );

            const mockSRs = [
                {
                    id: 1,
                    name: 'FLAG.1',
                    relatedMergeRequest: [],
                    __projId: projId,
                }, // Included
                {
                    id: 2,
                    name: 'FLAG.2',
                    relatedMergeRequest: [{ mergeRequestId: mrId }],
                    __projId: projId,
                }, // Not included
                /*
                {
                    id: 3,
                    name: 'FLAG.3',
                    relatedMergeRequest: [],
                    __projId: projId + 233,
                }, // Not included
                */
                {
                    id: 4,
                    name: 'FLAG.4',
                    relatedMergeRequest: [],
                    __projId: projId,
                }, // included
                {
                    id: 5,
                    name: 'FRAG.5',
                    relatedMergeRequest: [],
                    __projId: projId,
                }, // Not included
            ];
            functionalRepository.find.mockImplementationOnce(() => {
                return mockSRs;
            });

            /*
            for (let i = 0; i < 5; i++) {
                mockRequirementsService.validateFunctionalRequest.mockImplementationOnce(
                    (projectId, funcId) => {
                        expect(projectId).toBe(projId);
                        expect(funcId).toBeGreaterThanOrEqual(1);
                        expect(funcId).toBeLessThanOrEqual(5);
                        return mockSRs[funcId - 1].__projId === projectId;
                    },
                );
                }
                */

            const res = await gitController.getMergeRequestSuggestion(
                projId,
                mrId,
            );
            expect(res.code).toBe(200);
            expect(res.data.length).toBe(2);
            // allow reorder
            expect(res.data).toEqual(
                expect.arrayContaining([
                    {
                        id: 1,
                        name: 'FLAG.1',
                    },
                    {
                        id: 4,
                        name: 'FLAG.4',
                    },
                ]),
            );
        });
    });

    describe('getIssueCausedByFuncReq', () => {
        const projId = 233;
        const srId = 666;
        it('should return abnormal for invalid SR-Proj pair', async () => {
            mockRequirementsService.validateFunctionalRequest.mockImplementationOnce(
                (p, s) => {
                    expect(p).toBe(projId);
                    expect(s).toBe(srId);
                    return null;
                },
            );
            await expect(() =>
                gitController.getIssueCausedBy(projId, srId),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return correct finding results', async () => {
            mockRequirementsService.validateFunctionalRequest.mockImplementationOnce(
                (p, s) => {
                    expect(p).toBe(projId);
                    expect(s).toBe(srId);
                    return {
                        name: 'FLAG.001',
                    };
                },
            );

            const repoData = [
                {
                    issueId: 1,
                    title: 'awsl FLAG.001 awsl',
                    description: 'awsl',
                    state: 'open',
                    include: true,
                },
                {
                    issueId: 2,
                    title: 'awsl awsl',
                    description: 'awsl FLAG.001 awsl',
                    state: 'open',
                    include: true,
                },
                {
                    issueId: 3,
                    title: 'awsl awsl',
                    description: 'awsl FRAG.001 awsl',
                    state: 'closed',
                    include: false,
                },
            ];
            const result = repoData
                .filter((ele) => {
                    return ele.include;
                })
                .map((ele) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { include, issueId, description, ...res } = ele;
                    return { id: issueId, content: description, ...res };
                });

            issueRepository.find.mockImplementationOnce(({ projectId }) => {
                expect(projectId).toBe(projId);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return JSON.parse(JSON.stringify(repoData)); // trying to DEEP COPY
            });
            const resRecv = await gitController.getIssueCausedBy(projId, srId);
            expect(resRecv.data.length).toBe(result.length);
            expect(resRecv.data).toEqual(expect.arrayContaining(result));
        });
    });

    describe('get-issue-stat', () => {
        it('should return correct data', async () => {
            const projectId = 999;
            issueRepository.find.mockImplementationOnce(({ projectId: p }) => {
                expect(p).toBe(projectId);
                return [
                    { assignee: null, createTime: null, closeTime: null },
                    { assignee: 'A', createTime: null, closeTime: null },
                    { assignee: 'A', createTime: new Date(0), closeTime: null },
                    {
                        assignee: 'A',
                        createTime: new Date(100),
                        closeTime: new Date(233),
                    },
                    {
                        assignee: 'B',
                        createTime: new Date(1000),
                        closeTime: new Date(6666),
                    },
                    {
                        assignee: 'B',
                        createTime: new Date(10000),
                        closeTime: new Date(998244353),
                    },
                    {
                        assignee: 'B',
                        createTime: null,
                        closeTime: new Date(19260817),
                    },
                ];
            });

            const res = await gitController.getIssueStat(projectId);
            expect(res.data).toEqual([
                {
                    name: 'A',
                    openIssue: 2,
                    time: [233 - 100],
                },
                {
                    name: 'B',
                    openIssue: 1,
                    time: [6666 - 1000, 998244353 - 10000],
                },
            ]);
        });
    });

    describe('get-merge-request-stat', () => {
        it('should return correct stat', async () => {
            const projectId = 65472;
            mergeRequestRepository.find.mockImplementationOnce(
                ({ projectId: p }) => {
                    expect(p).toBe(projectId);
                    return [
                        { assignee: null },
                        { assignee: 'A' },
                        { assignee: 'B' },
                        { assignee: 'A' },
                        { assignee: 'C' },
                        { assignee: null },
                        { assignee: 'D' },
                    ];
                },
            );
            const res = await gitController.getMergeRequestStat(projectId);
            expect(res.data).toEqual([
                { name: 'A', mergeRequest: 2 },
                { name: 'B', mergeRequest: 1 },
                { name: 'C', mergeRequest: 1 },
                { name: 'D', mergeRequest: 1 },
            ]);
        });
    });
});

import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ValidityCheck } from '../utils/validity-check';
import { Repository } from 'typeorm';
import { ProjectCreateDto } from './dto/project-create.dto';
import { Project } from './entities/proejct.entity';
import { ProjectInviteDto } from './dto/project-invite.dto';
import { RequirementsService } from './requirements.service';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { SystemServicesService } from './system-services.service';
import { IterationsService } from './iterations.service';
import { MergeRequest } from '../git/entities/mergeRequest.entity';
import { Issue } from '../git/entities/issue.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(MergeRequest)
        private readonly mergeRequestRepository: Repository<MergeRequest>,
        @InjectRepository(Issue)
        private readonly issueRepository: Repository<Issue>,
        private readonly requirementsService: RequirementsService,
        private readonly systemServicesService: SystemServicesService,
        private readonly iterationsService: IterationsService,
    ) {}

    async findAll(userId: number) {
        if (!ValidityCheck.checkGeneralId(userId)) {
            throw new BadRequestException("001# User's id check failed");
        }
        const user = await this.userRepository.findOne(
            {
                id: userId,
            },
            {
                relations: [
                    'ownProjects',
                    'devProjects',
                    'qaProjects',
                    'sysProjects',
                ],
            },
        );
        if (!user) {
            throw new NotFoundException(`002# User ${userId} does not exist`);
        }
        let projectIds = user.ownProjects.map((project) => project.id);
        projectIds.push(...user.devProjects.map((project) => project.id));
        projectIds.push(...user.sysProjects.map((project) => project.id));
        projectIds.push(...user.qaProjects.map((project) => project.id));
        projectIds = Array.from(new Set(projectIds)).sort((a, b) => a - b);
        return Promise.all(
            projectIds.map(async (projectId) => {
                return await this.findOne(projectId, user.username);
            }),
        );
    }

    async findOne(projectId: number, username: string) {
        if (ValidityCheck.checkProjectId(projectId) === false) {
            throw new BadRequestException("001# Project's id check failed");
        }
        const project = await this.projectRepository.findOne(
            {
                id: projectId,
            },
            {
                relations: [
                    'manager',
                    'systemEngineers',
                    'developmentEngineers',
                    'qualityAssuranceEngineers',
                ],
            },
        );
        if (!project) {
            throw new NotFoundException(`002# Project ${projectId} not found`);
        }
        const developmentEngineerNames = project.developmentEngineers.map(
            (user) => {
                return user.username;
            },
        );
        const systemEngineerNames = project.systemEngineers.map((user) => {
            return user.username;
        });
        const qualityAssuranceEngineerNames =
            project.qualityAssuranceEngineers.map((user) => {
                return user.username;
            });
        if (
            !(
                project.manager.username === username ||
                developmentEngineerNames.includes(username) ||
                systemEngineerNames.includes(username) ||
                qualityAssuranceEngineerNames.includes(username)
            )
        ) {
            throw new UnauthorizedException(
                `003# User ${username} is not authorized to access this project`,
            );
        }
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            manager: project.manager.username,
            developmentEngineers: developmentEngineerNames,
            systemEngineers: systemEngineerNames,
            qualityAssuranceEngineers: qualityAssuranceEngineerNames,
            createDate: project.createDate.getTime(),
            updateDate: project.updateDate.getTime(),
        };
    }

    async create(projectCreateDto: ProjectCreateDto) {
        const { projectName, managerName, description } = projectCreateDto;
        if (ValidityCheck.checkProjectName(projectName) === false) {
            throw new BadRequestException("Project's name check failed");
        }
        if (ValidityCheck.checkUsername(managerName) === false) {
            throw new BadRequestException("Manager's name check failed");
        }
        const manager = await this.userRepository.findOne(
            {
                username: managerName,
            },
            {
                relations: ['ownProjects'],
            },
        );
        if (!manager) {
            throw new BadRequestException("Manager doesn't exist");
        }
        try {
            const projectToSave = this.projectRepository.create({
                name: projectName,
                description: description ? description : '',
                isDeleted: false,
                state: 0,
                manager: manager,
                systemEngineers: [],
                developmentEngineers: [],
                qualityAssuranceEngineers: [],
                originalRequirements: [],
                systemServices: [],
            });
            await this.projectRepository.save(projectToSave);
            return {
                id: projectToSave.id,
                name: projectToSave.name,
            };
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    async updateProject(projectId: number, projectUpdateDto: ProjectUpdateDto) {
        const project = await this.projectRepository.findOneOrFail({
            id: projectId,
        });
        if (
            projectUpdateDto.name !== undefined &&
            projectUpdateDto.name !== null
        ) {
            if (!ValidityCheck.checkProjectName(projectUpdateDto.name)) {
                throw new BadRequestException(
                    "001# Project's name check failed",
                );
            }
            project.name = projectUpdateDto.name;
        }
        if (
            projectUpdateDto.description !== undefined &&
            projectUpdateDto.description !== null
        ) {
            project.description = projectUpdateDto.description;
        }
        await this.projectRepository.save(project);
        return projectId;
    }

    async deleteProject(projectId: number) {
        const project = await this.projectRepository.findOneOrFail(
            { id: projectId },
            {
                relations: [
                    'originalRequirements',
                    'systemServices',
                    'iterations',
                ],
            },
        );
        for (const ori of project.originalRequirements) {
            await this.requirementsService.deleteOriginalRequirement(
                projectId,
                ori.id,
            );
        }
        for (const serv of project.systemServices) {
            await this.systemServicesService.deleteSystemService(
                projectId,
                serv.id,
            );
        }
        for (const iter of project.iterations) {
            await this.iterationsService.deleteIteration(projectId, iter.id);
        }
        const mergeRequests = await this.mergeRequestRepository.find({
            where: { projectId: project.id },
        });
        await this.mergeRequestRepository.remove(mergeRequests);
        await this.issueRepository.delete({ projectId: project.id });
        const projectToDelete = await this.projectRepository.findOneOrFail(
            { id: projectId },
            {
                relations: [
                    'systemEngineers',
                    'developmentEngineers',
                    'qualityAssuranceEngineers',
                ],
            },
        );
        projectToDelete.systemEngineers = [];
        projectToDelete.developmentEngineers = [];
        projectToDelete.qualityAssuranceEngineers = [];
        await this.projectRepository.save(projectToDelete);
        await this.projectRepository.delete({ id: projectId });
        return projectId;
    }

    /**
     * invite - inviting users to a project, and giving roles, can also delete roles
     * @param projectId: id of the project
     * @param projectInviteDto: post info sent
     * @returns: empty funcIds and iterIds array
     * @throws BadRequestException if user not exist
     * @throws NotFoundException if project not found
     * @throws InternalServerErrorException if database operation failed
     */
    async invite(projectId: number, projectInviteDto: ProjectInviteDto) {
        // Pay attention: access check should be done within role check guards

        // Find User
        const invitedUser = await this.userRepository.findOne(
            {
                id: projectInviteDto.invitedUser,
            },
            {
                relations: ['sysProjects', 'devProjects', 'qaProjects'],
            },
        );
        if (!invitedUser) {
            throw new BadRequestException('Invited user does not exist');
        }

        // Find project
        const project = await this.projectRepository.findOne(
            { id: projectId },
            {
                relations: ['iterations', 'originalRequirements'],
            },
        );

        if (!project) {
            throw new NotFoundException('Project does not exist');
        }

        // returned ids, nothing wrong if they are both empty
        const iterIds = Array<number>();
        const funcIds = Array<number>();

        // Give permission, if it hasn't been given
        if (projectInviteDto.grantedRole.includes(1)) {
            if (
                !invitedUser.sysProjects
                    .map((pro) => pro.id)
                    .includes(project.id)
            ) {
                invitedUser.sysProjects.push(project);
            }
        } else {
            if (
                invitedUser.sysProjects
                    .map((pro) => pro.id)
                    .includes(project.id)
            ) {
                invitedUser.sysProjects = invitedUser.sysProjects.filter(
                    (theProject) => theProject.id !== project.id,
                );
            }
        }
        if (projectInviteDto.grantedRole.includes(2)) {
            // If the user isn't this project's development engineer, add him or her.
            if (
                !invitedUser.devProjects
                    .map((pro) => pro.id)
                    .includes(project.id)
            ) {
                invitedUser.devProjects.push(project);
            }
        } else {
            // remove the development engineer, may fail
            if (
                invitedUser.devProjects
                    .map((pro) => pro.id)
                    .includes(project.id)
            ) {
                iterIds.push(
                    ...project.iterations
                        .filter(
                            (iter) =>
                                iter.directorUsername === invitedUser.username,
                        )
                        .map((iter) => iter.id),
                );
                const functionRequirements =
                    await this.requirementsService.findAllFunctionalRequirements(
                        projectId,
                        0,
                    );
                funcIds.push(
                    ...functionRequirements
                        .filter(
                            (func) =>
                                func.state <= 2 &&
                                func.developerId === invitedUser.id,
                        )
                        .map((func) => func.id),
                );
                if (iterIds.length === 0 && funcIds.length === 0) {
                    invitedUser.devProjects = invitedUser.devProjects.filter(
                        (theProject) => theProject.id !== project.id,
                    );
                }
            }
        }
        if (projectInviteDto.grantedRole.includes(3)) {
            if (
                !invitedUser.qaProjects
                    .map((pro) => pro.id)
                    .includes(project.id)
            ) {
                invitedUser.qaProjects.push(project);
            }
        } else {
            if (
                invitedUser.qaProjects.map((pro) => pro.id).includes(project.id)
            ) {
                invitedUser.qaProjects = invitedUser.qaProjects.filter(
                    (theProject) => theProject.id !== project.id,
                );
            }
        }
        try {
            await this.userRepository.save(invitedUser);
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
        return {
            iterIds: iterIds.sort((a, b) => a - b),
            funcIds: funcIds.sort((a, b) => a - b),
        };
    }
}

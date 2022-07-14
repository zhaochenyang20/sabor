import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidityCheck } from '../utils/validity-check';
import { Connection, Repository } from 'typeorm';
import { OriginalRequirementCreateDto } from './dto/original-requirement-create.dto';
import { OriginalRequirementUpdateDto } from './dto/original-requirement-update.dto';
import { OriginalRequirement } from './entities/originalRequirement.entity';
import { Project } from './entities/proejct.entity';
import { FunctionalRequirement } from './entities/functionalRequirement.entity';
import { FunctionalRequirementCreateDto } from './dto/functional-requirement-create.dto';
import { SystemService } from './entities/systemService.entity';
import { Iteration } from './entities/iteration.entity';
import { User } from '../users/entities/user.entity';
import { MergeRequest } from '../git/entities/mergeRequest.entity';
import { FunctionalRequirementChangeStateDto } from './dto/functional-requirement-change-state.dto';
import { FindByIdDto } from './dto/find-by-id.dto';

@Injectable()
export class RequirementsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(OriginalRequirement)
        private readonly originalRequirementRepository: Repository<OriginalRequirement>,
        @InjectRepository(FunctionalRequirement)
        private readonly functionalRequirementRepository: Repository<FunctionalRequirement>,
        @InjectRepository(SystemService)
        private readonly systemServiceRepository: Repository<SystemService>,
        @InjectRepository(Iteration)
        private readonly iterationRepository: Repository<Iteration>,
        @InjectRepository(MergeRequest)
        private readonly mergeRequestRepository: Repository<MergeRequest>,
        private readonly connection: Connection,
    ) {}

    async reset() {
        const funcs = await this.functionalRequirementRepository.find({
            relations: ['originalRequirement'],
        });
        for (const func of funcs) {
            const ori = await this.originalRequirementRepository.findOneOrFail(
                { id: func.originalRequirement.id },
                {
                    relations: ['project'],
                },
            );
            func.projectId = ori.project.id;
        }
        await this.functionalRequirementRepository.save(funcs);
        return 'success';
    }

    /**
     * return the relations between the user and the project
     * @param userId `number`
     * @param projectId `number`
     * @returns relations: `number[]`
     *
     * if includes 0: manager
     *
     * if includes 1: system engineer
     *
     * if includes 2: development engineer
     *
     * if includes 3: QA engineer
     */
    async checkUserWithProject(userId: number, projectId: number) {
        const user = await this.userRepository.findOne(
            { id: userId },
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
            return [];
        }
        const relations: number[] = [];
        if (user.ownProjects.map((project) => project.id).includes(projectId)) {
            relations.push(0);
        }
        if (user.sysProjects.map((project) => project.id).includes(projectId)) {
            relations.push(1);
        }
        if (user.devProjects.map((project) => project.id).includes(projectId)) {
            relations.push(2);
        }
        if (user.qaProjects.map((project) => project.id).includes(projectId)) {
            relations.push(3);
        }
        return relations;
    }

    async findAllOriginalRequirements(projectId: number) {
        const project = await this.projectRepository.findOne(
            { id: projectId },
            {
                relations: ['originalRequirements'],
            },
        );
        if (!project) {
            throw new NotFoundException('001# Project does not exist');
        }
        const oriIds = project.originalRequirements.map((ori) => ori.id);
        const requirements = await this.originalRequirementRepository.findByIds(
            oriIds,
            { relations: ['functionalRequirements'] },
        );
        const ret = requirements
            .map((requirement) => {
                return {
                    id: requirement.id,
                    name: requirement.name,
                    description: requirement.description,
                    projectId: projectId,
                    creatorName: requirement.creatorUsername,
                    functionalRequirementIds:
                        requirement.functionalRequirements.map((sr) => {
                            return sr.id;
                        }),
                    functionalRequirements:
                        requirement.functionalRequirements.map((sr) => {
                            return {
                                id: sr.id,
                                name: sr.name,
                                description: sr.description,
                                state: sr.state,
                            };
                        }),
                };
            })
            .sort((a, b) => a.id - b.id);
        return ret;
    }

    async findOneOriginalRequirement(projectId: number, requireId: number) {
        const requirement = await this.originalRequirementRepository.findOne(
            {
                id: requireId,
            },
            {
                relations: ['functionalRequirements', 'project'],
            },
        );
        if (!requirement) {
            throw new NotFoundException('001# Original requirement not found');
        }
        if (requirement.project.id !== projectId) {
            throw new UnauthorizedException();
        }
        return {
            id: requirement.id,
            name: requirement.name,
            description: requirement.description,
            projectId: projectId,
            creatorName: requirement.creatorUsername,
            functionalRequirementIds: requirement.functionalRequirements.map(
                (sr) => {
                    return sr.id;
                },
            ),
            functionalRequirements: requirement.functionalRequirements.map(
                (sr) => {
                    return {
                        id: sr.id,
                        name: sr.name,
                        description: sr.description,
                        state: sr.state,
                    };
                },
            ),
        };
    }

    /**
     * createOriginalRequirement: create an original requirement
     * @param projectId id of the project
     * @param oriDto original requirement info
     * @param creatorName creator's name
     * @returns original requirement's id
     */
    async createOriginalRequirement(
        projectId: number,
        oriDto: OriginalRequirementCreateDto,
        creatorName: string,
    ) {
        if (ValidityCheck.checkGeneralName(oriDto.name) === false) {
            throw new BadRequestException(
                "001# Requirement's name check failed",
            );
        }
        const project = await this.projectRepository.findOneOrFail(
            { id: projectId },
            {
                relations: ['originalRequirements'],
            },
        );
        if (
            project.originalRequirements.find(
                (ori) => ori.name === oriDto.name,
            ) !== undefined
        ) {
            throw new BadRequestException(
                `002# Name ${oriDto.name} duplicates`,
            );
        }
        const originalRequirement = new OriginalRequirement();
        originalRequirement.name = oriDto.name;
        originalRequirement.description = oriDto.description;
        originalRequirement.state = 1;
        originalRequirement.isDeleted = false;
        originalRequirement.creatorUsername = creatorName;
        project.originalRequirements.push(originalRequirement); // cascade
        try {
            await this.projectRepository.save(project);
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
        return {
            originalRequirementId: originalRequirement.id,
        };
    }

    async updateOriginalRequirement(
        projectId: number,
        oriDto: OriginalRequirementUpdateDto,
    ) {
        const project = await this.projectRepository.findOneOrFail(
            { id: projectId },
            { relations: ['originalRequirements'] },
        );
        const ori = await this.originalRequirementRepository.findOne(
            { id: oriDto.id },
            { relations: ['project'] },
        );
        if (!ori) {
            throw new NotFoundException(
                `001# original requirement ${oriDto.id} not found`,
            );
        }
        if (ori.project.id !== projectId) {
            throw new UnauthorizedException(
                `004# It is unauthorized to change original requirement ${oriDto.id}`,
            );
        }
        if (
            oriDto.name !== undefined &&
            oriDto.name !== null &&
            oriDto.name !== ori.name
        ) {
            if (!ValidityCheck.checkGeneralName(oriDto.name)) {
                throw new BadRequestException(
                    "002# Requirement's name check failed",
                );
            }
            if (
                project.originalRequirements.find(
                    (theOri) => theOri.name === oriDto.name,
                ) !== undefined
            ) {
                throw new BadRequestException(
                    `003# Name ${oriDto.name} duplicates`,
                );
            }
            ori.name = oriDto.name;
        }
        if (oriDto.description !== undefined && oriDto.description !== null) {
            ori.description = oriDto.description;
        }
        try {
            await this.originalRequirementRepository.save(ori);
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
        return ori.id;
    }

    async deleteOriginalRequirement(projectId: number, oriId: number) {
        const ori = await this.findOneOriginalRequirement(projectId, oriId);
        for (const funcId of ori.functionalRequirementIds) {
            await this.deleteFunctionalRequirement(projectId, funcId);
        }
        await this.originalRequirementRepository.delete({ id: oriId });
        return oriId;
    }

    async findOneFunctionalRequirement(projectId: number, funcId: number) {
        const func = await this.functionalRequirementRepository.findOne(
            {
                id: funcId,
            },
            {
                relations: [
                    'originalRequirement',
                    'systemService',
                    'deliveryIteration',
                ],
            },
        );
        if (!func) {
            throw new NotFoundException(
                `002# Functional requirement ${funcId} does not exist`,
            );
        }
        if (func.projectId !== projectId) {
            throw new UnauthorizedException(
                `001# It is unauthorized to find functional requirement ${funcId}`,
            );
        }
        return {
            id: func.id,
            name: func.name,
            description: func.description,
            state: func.state,
            projectId: func.projectId,
            originalRequirementId: func.originalRequirement.id,
            distributorId: func.distributorId,
            developerId: func.developerId,
            systemServiceId: func.systemService
                ? func.systemService.id
                : undefined,
            deliveryIterationId: func.deliveryIteration
                ? func.deliveryIteration.id
                : undefined,
            createDate: func.createDate.getTime(),
            updateDate: func.updateDate.getTime(),
        };
    }

    /** get all functional requirements
     * @param projectId
     * @param oriId
     * @returns functional requirements in original requirement oriId,
     * if oriId == 0, return all functional requirements in project projectId
     */
    async findAllFunctionalRequirements(projectId: number, oriId: number) {
        if (oriId === 0) {
            const funcs = await this.functionalRequirementRepository.find({
                where: { projectId: projectId },
                relations: [
                    'originalRequirement',
                    'systemService',
                    'deliveryIteration',
                ],
            });
            return funcs
                .map((func) => {
                    return {
                        id: func.id,
                        name: func.name,
                        description: func.description,
                        state: func.state,
                        projectId: func.projectId,
                        originalRequirementId: func.originalRequirement.id,
                        distributorId: func.distributorId,
                        developerId: func.developerId,
                        systemServiceId: func.systemService
                            ? func.systemService.id
                            : undefined,
                        deliveryIterationId: func.deliveryIteration
                            ? func.deliveryIteration.id
                            : undefined,
                        createDate: func.createDate.getTime(),
                        updateDate: func.updateDate.getTime(),
                    };
                })
                .sort((a, b) => a.id - b.id);
        } else {
            const ori = await this.findOneOriginalRequirement(projectId, oriId);
            return await this.findFunctionalRequirementsByIds(projectId, {
                ids: ori.functionalRequirementIds,
            });
        }
    }

    /** find functional requirements by ids, duplicate or illegal ids will be filtered out without error
     * @param projectId
     * @param funcFindDto
     * @returns array of functional requirements
     */
    async findFunctionalRequirementsByIds(
        projectId: number,
        funcFindDto: FindByIdDto,
    ) {
        const funcs = await this.functionalRequirementRepository.findByIds(
            funcFindDto.ids,
            {
                relations: [
                    'originalRequirement',
                    'systemService',
                    'deliveryIteration',
                ],
            },
        );
        return funcs
            .filter((func) => func.projectId === projectId)
            .map((func) => {
                return {
                    id: func.id,
                    name: func.name,
                    description: func.description,
                    state: func.state,
                    projectId: func.projectId,
                    originalRequirementId: func.originalRequirement.id,
                    distributorId: func.distributorId,
                    developerId: func.developerId,
                    systemServiceId: func.systemService
                        ? func.systemService.id
                        : undefined,
                    deliveryIterationId: func.deliveryIteration
                        ? func.deliveryIteration.id
                        : undefined,
                    createDate: func.createDate.getTime(),
                    updateDate: func.updateDate.getTime(),
                };
            })
            .sort((a, b) => a.id - b.id);
    }

    async createFunctionalRequirement(
        projectId: number,
        funcDto: FunctionalRequirementCreateDto,
        userId: number,
    ) {
        const funcNames = (
            await this.findAllFunctionalRequirements(projectId, 0)
        ).map((func) => func.name);
        if (!funcDto.id) {
            // create
            if (!ValidityCheck.checkGeneralName(funcDto.name)) {
                throw new BadRequestException(
                    "001# Functional requirement's name check failed",
                );
            }
            if (funcNames.includes(funcDto.name)) {
                throw new BadRequestException(
                    `009# Name ${funcDto.name} duplicates`,
                );
            }
            const funcToSave = new FunctionalRequirement();
            funcToSave.name = funcDto.name;
            funcToSave.description = funcDto.description;
            funcToSave.state = 1;
            funcToSave.projectId = projectId;
            funcToSave.distributorId = userId;
            if (funcDto.developerId === 0) {
                funcToSave.developerId = 0;
            } else if (
                funcDto.developerId !== undefined &&
                funcDto.developerId !== null
            ) {
                if (
                    (
                        await this.checkUserWithProject(
                            funcDto.developerId,
                            projectId,
                        )
                    ).includes(2) === false
                ) {
                    throw new UnauthorizedException(
                        `002# User ${funcDto.developerId} is not a development engineer`,
                    );
                }
                funcToSave.developerId = funcDto.developerId;
            }
            const ori = await this.originalRequirementRepository.findOne(
                {
                    id: funcDto.originalRequirementId,
                },
                {
                    relations: ['functionalRequirements', 'project'],
                },
            );
            if (!ori || ori.project.id !== projectId) {
                throw new NotFoundException(
                    `003# Original requirement ${funcDto.originalRequirementId} does not exist`,
                );
            }
            // Transcation
            // https://typeorm.io/transactions#using-queryrunner-to-create-and-control-state-of-single-database-connection
            const queryRunner = this.connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                ori.functionalRequirements.push(funcToSave);
                await queryRunner.manager.save(ori);
                if (
                    funcDto.systemServiceId !== undefined &&
                    funcDto.systemServiceId !== null
                ) {
                    const serv = await this.systemServiceRepository.findOne(
                        {
                            id: funcDto.systemServiceId,
                        },
                        {
                            relations: ['functionalRequirements', 'project'],
                        },
                    );
                    if (!serv || serv.project.id !== projectId) {
                        throw new NotFoundException(
                            `004# System service ${funcDto.systemServiceId} does not exist`,
                        );
                    }
                    serv.functionalRequirements.push(funcToSave);
                    await queryRunner.manager.save(serv);
                }
                if (
                    funcDto.iterationId !== undefined &&
                    funcDto.iterationId !== null
                ) {
                    const iter = await this.iterationRepository.findOne(
                        {
                            id: funcDto.iterationId,
                        },
                        {
                            relations: ['functionalRequirements', 'project'],
                        },
                    );
                    if (!iter || iter.project.id !== projectId) {
                        throw new NotFoundException(
                            `005# Iteration ${funcDto.iterationId} does not exist`,
                        );
                    }
                    iter.functionalRequirements.push(funcToSave);
                    await queryRunner.manager.save(iter);
                }
                await queryRunner.commitTransaction();
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
            return funcToSave.id;
        } else {
            // update
            const funcToSave =
                await this.functionalRequirementRepository.findOne(
                    {
                        id: funcDto.id,
                    },
                    {
                        relations: [
                            'originalRequirement',
                            'systemService',
                            'deliveryIteration',
                        ],
                    },
                );
            if (!funcToSave) {
                throw new NotFoundException(
                    `006# Functional requirement ${funcDto.id} does not exist`,
                );
            }
            if (funcToSave.projectId !== projectId) {
                throw new UnauthorizedException(
                    `008# It is unauthorized to find functional requirement ${funcDto.id}`,
                );
            }
            if (
                funcDto.name !== undefined &&
                funcDto.name !== null &&
                funcDto.name !== funcToSave.name
            ) {
                if (!ValidityCheck.checkGeneralName(funcDto.name)) {
                    throw new BadRequestException(
                        "007# Functional requirement's name check failed",
                    );
                }
                if (funcNames.includes(funcDto.name)) {
                    throw new BadRequestException(
                        `009# Name ${funcDto.name} duplicates`,
                    );
                }
                funcToSave.name = funcDto.name;
            }
            if (
                funcDto.description !== undefined &&
                funcDto.description !== null
            ) {
                funcToSave.description = funcDto.description;
            }
            if (funcDto.state !== undefined && funcDto.state !== null) {
                funcToSave.state = funcDto.state;
            }
            if (funcDto.developerId === 0) {
                funcToSave.developerId = 0;
            } else if (
                funcDto.developerId !== undefined &&
                funcDto.developerId !== null
            ) {
                if (
                    (
                        await this.checkUserWithProject(
                            funcDto.developerId,
                            projectId,
                        )
                    ).includes(2) === false
                ) {
                    throw new UnauthorizedException(
                        `002# User ${funcDto.developerId} is not a development engineer`,
                    );
                }
                funcToSave.developerId = funcDto.developerId;
            }
            // transcation
            const queryRunner = this.connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                await queryRunner.manager.save(funcToSave);
                if (
                    funcDto.originalRequirementId !== undefined &&
                    funcDto.originalRequirementId !== null
                ) {
                    if (
                        funcToSave.originalRequirement.id !==
                        funcDto.originalRequirementId
                    ) {
                        const oldOri =
                            await this.originalRequirementRepository.findOneOrFail(
                                {
                                    id: funcToSave.originalRequirement.id,
                                },
                                {
                                    relations: ['functionalRequirements'],
                                },
                            );
                        const newOri =
                            await this.originalRequirementRepository.findOne(
                                {
                                    id: funcDto.originalRequirementId,
                                },
                                {
                                    relations: ['functionalRequirements'],
                                },
                            );
                        if (!newOri || newOri.project.id !== projectId) {
                            throw new NotFoundException(
                                `003# New original requirement ${funcDto.originalRequirementId} does not exist`,
                            );
                        }
                        oldOri.functionalRequirements =
                            oldOri.functionalRequirements.filter(
                                (func) => func.id !== funcDto.id,
                            );

                        newOri.functionalRequirements.push(funcToSave);
                        funcToSave.originalRequirement = newOri;
                        await queryRunner.manager.save(funcToSave);
                        await queryRunner.manager.save(oldOri);
                        await queryRunner.manager.save(newOri);
                    }
                }
                if (
                    funcDto.systemServiceId !== undefined &&
                    funcDto.systemServiceId !== null
                ) {
                    if (funcDto.systemServiceId === 0) {
                        const oldServId = funcToSave.systemService
                            ? funcToSave.systemService.id
                            : undefined;
                        const oldServ =
                            await this.systemServiceRepository.findOne(
                                {
                                    id: oldServId,
                                },
                                {
                                    relations: ['functionalRequirements'],
                                },
                            );
                        if (oldServ) {
                            oldServ.functionalRequirements =
                                oldServ.functionalRequirements.filter(
                                    (func) => func.id !== funcToSave.id,
                                );
                            await queryRunner.manager.save(oldServ);
                        }
                    } else if (
                        !funcToSave.systemService ||
                        funcToSave.systemService.id !== funcDto.systemServiceId
                    ) {
                        const oldServId = funcToSave.systemService
                            ? funcToSave.systemService.id
                            : undefined;
                        const oldServ =
                            await this.systemServiceRepository.findOne(
                                {
                                    id: oldServId,
                                },
                                {
                                    relations: ['functionalRequirements'],
                                },
                            );
                        const newServ =
                            await this.systemServiceRepository.findOne(
                                {
                                    id: funcDto.systemServiceId,
                                },
                                {
                                    relations: [
                                        'functionalRequirements',
                                        'project',
                                    ],
                                },
                            );
                        if (!newServ || newServ.project.id !== projectId) {
                            throw new NotFoundException(
                                `004# New system service ${funcDto.systemServiceId} does not exist`,
                            );
                        }
                        funcToSave.systemService = newServ;
                        await queryRunner.manager.save(funcToSave);
                        if (oldServ) {
                            oldServ.functionalRequirements =
                                oldServ.functionalRequirements.filter(
                                    (func) => func.id !== funcToSave.id,
                                );
                            await queryRunner.manager.save(oldServ);
                        }
                        newServ.functionalRequirements.push(funcToSave);
                        await queryRunner.manager.save(newServ);
                    }
                }
                if (
                    funcDto.iterationId !== undefined &&
                    funcDto.iterationId !== null
                ) {
                    if (funcDto.iterationId === 0) {
                        const oldIterId = funcToSave.deliveryIteration
                            ? funcToSave.deliveryIteration.id
                            : undefined;
                        const oldIter = await this.iterationRepository.findOne(
                            {
                                id: oldIterId,
                            },
                            {
                                relations: ['functionalRequirements'],
                            },
                        );
                        if (oldIter) {
                            oldIter.functionalRequirements =
                                oldIter.functionalRequirements.filter(
                                    (func) => func.id !== funcToSave.id,
                                );
                            await queryRunner.manager.save(oldIter);
                        }
                    } else if (
                        !funcToSave.deliveryIteration ||
                        funcToSave.deliveryIteration.id !== funcDto.iterationId
                    ) {
                        const oldIterId = funcToSave.deliveryIteration
                            ? funcToSave.deliveryIteration.id
                            : undefined;
                        const oldIter = await this.iterationRepository.findOne(
                            {
                                id: oldIterId,
                            },
                            {
                                relations: ['functionalRequirements'],
                            },
                        );
                        const newIter = await this.iterationRepository.findOne(
                            {
                                id: funcDto.iterationId,
                            },
                            {
                                relations: [
                                    'functionalRequirements',
                                    'project',
                                ],
                            },
                        );
                        if (!newIter || newIter.project.id !== projectId) {
                            throw new NotFoundException(
                                `005# New iteration ${funcDto.iterationId} does not exist`,
                            );
                        }
                        funcToSave.deliveryIteration = newIter;
                        await queryRunner.manager.save(funcToSave);
                        if (oldIter) {
                            oldIter.functionalRequirements =
                                oldIter.functionalRequirements.filter(
                                    (func) => func.id !== funcToSave.id,
                                );
                            await queryRunner.manager.save(oldIter);
                        }
                        newIter.functionalRequirements.push(funcToSave);
                        await queryRunner.manager.save(newIter);
                    }
                }
                await queryRunner.commitTransaction();
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
            return funcToSave.id;
        }
    }

    async deleteFunctionalRequirement(projectId: number, funcId: number) {
        // validation
        const func = await this.findOneFunctionalRequirement(projectId, funcId);
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (
                func.systemServiceId !== undefined &&
                func.systemServiceId !== null
            ) {
                const serv = await this.systemServiceRepository.findOneOrFail(
                    {
                        id: func.systemServiceId,
                    },
                    {
                        relations: ['functionalRequirements'],
                    },
                );
                serv.functionalRequirements =
                    serv.functionalRequirements.filter(
                        (theFunc) => theFunc.id !== func.id,
                    );
                await queryRunner.manager.save(serv);
            }
            if (
                func.deliveryIterationId !== undefined &&
                func.deliveryIterationId !== null
            ) {
                const iter = await this.iterationRepository.findOneOrFail(
                    {
                        id: func.deliveryIterationId,
                    },
                    {
                        relations: ['functionalRequirements'],
                    },
                );
                iter.functionalRequirements =
                    iter.functionalRequirements.filter(
                        (theFunc) => theFunc.id !== func.id,
                    );
                await queryRunner.manager.save(iter);
            }
            const funcForMR =
                await this.functionalRequirementRepository.findOneOrFail(
                    {
                        id: funcId,
                    },
                    {
                        relations: ['relatedMergeRequest'],
                    },
                );
            const mergeRequests = await this.mergeRequestRepository.findByIds(
                funcForMR.relatedMergeRequest.map((mr) => mr.sid),
                {
                    relations: ['relatedFunctionalRequirement'],
                },
            );
            for (const mr of mergeRequests) {
                mr.relatedFunctionalRequirement =
                    mr.relatedFunctionalRequirement.filter(
                        (theFunc) => theFunc.id !== funcId,
                    );
                await queryRunner.manager.save(mr);
            }
            const ori = await this.originalRequirementRepository.findOneOrFail(
                {
                    id: func.originalRequirementId,
                },
                {
                    relations: ['functionalRequirements'],
                },
            );
            ori.functionalRequirements = ori.functionalRequirements.filter(
                (theFunc) => theFunc.id !== func.id,
            );
            await queryRunner.manager.save(ori);
            await queryRunner.manager.delete(FunctionalRequirement, {
                id: funcId,
            });
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
        return func.id;
    }

    async changeFunctionalRequirementState(
        projectId: number,
        funcDto: FunctionalRequirementChangeStateDto,
    ) {
        const func = await this.functionalRequirementRepository.findOne({
            id: funcDto.id,
        });
        if (!func) {
            throw new NotFoundException(
                `002# Functional requirement ${funcDto.id} does not exist`,
            );
        }
        if (func.projectId !== projectId) {
            throw new UnauthorizedException(
                `001# It is unauthorized to change functional requirement ${funcDto.id}`,
            );
        }
        func.state = funcDto.state;
        try {
            await this.functionalRequirementRepository.save(func);
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
        return funcDto.id;
    }

    /** validate if a functional request exists, and
     * belongs to certain project
     * @param projectId:
     * @param functionalRequestId:
     * @returns the FunctionalRequest if ok, null if otherwise
     */
    async validateFunctionalRequest(
        projectId: number,
        functionalRequestId: number,
    ): Promise<FunctionalRequirement | null> {
        const funcReq = await this.functionalRequirementRepository.findOne(
            { id: functionalRequestId },
            { relations: ['originalRequirement'] },
        );
        if (!funcReq) return null;

        const oriReq = await this.originalRequirementRepository.findOne(
            { id: funcReq.originalRequirement.id },
            { relations: ['project'] },
        );

        if (!oriReq) return null;
        return oriReq.project.id === projectId ? funcReq : null;
    }
}

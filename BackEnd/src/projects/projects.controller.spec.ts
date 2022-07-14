import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/proejct.entity';
import { User } from '../users/entities/user.entity';
import {
    createMockRepository,
    mockFunctionalRequirement,
    mockFunctionalRequirementRepository,
    mockIteration,
    mockIterationRepository,
    mockOriginalRequirement,
    mockOriginalRequirement2,
    mockOriginalRequirementRepository,
    mockProject,
    mockProjectRepository,
    MockRepository,
    mockSystemService,
    mockSystemService2,
    mockSystemServiceRepository,
    mockUser2,
    mockUserRepository,
} from '../mocks/mock-repository';
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { OriginalRequirement } from './entities/originalRequirement.entity';
import { FunctionalRequirement } from './entities/functionalRequirement.entity';
import { OriginalRequirementCreateDto } from './dto/original-requirement-create.dto';
import { OriginalRequirementUpdateDto } from './dto/original-requirement-update.dto';
import { RequirementsService } from './requirements.service';
import { SystemServicesService } from './system-services.service';
import { SystemService } from './entities/systemService.entity';
import { Iteration } from './entities/iteration.entity';
import { IterationsService } from './iterations.service';
import { IterationCreateDto } from './dto/iteration-create.dto';
import { RolesGuard } from '../roles/roles.guard';
import { FunctionalRequirementCreateDto } from './dto/functional-requirement-create.dto';
import { Connection, EntityManager } from 'typeorm';
import {
    mockMergeRequestRepository,
    mockIssueRepository,
} from '../mocks/mock-repository-git';
import { MergeRequest } from '../git/entities/mergeRequest.entity';
import { Issue } from '../git/entities/issue.entity';

describe('ProjectsController', () => {
    let controller: ProjectsController;
    let projectRepository: MockRepository;
    let userRepository: MockRepository;
    let originalRequirementRepository: MockRepository;
    let functionalRequirementRepository: MockRepository;
    let systemServiceRepository: MockRepository;
    let iterationServiceRepository: MockRepository;
    let mergeRequestRepository: MockRepository;
    let issueRepository: MockRepository;
    let connection: MockConnection;

    type MockConnection = Partial<Record<keyof Connection, jest.Mock>>;

    const createMockConnection = (): MockConnection => ({
        createQueryRunner: jest.fn(),
    });

    type MockQueryRunner = {
        connect: jest.Mock<any, any>;
        startTransaction: jest.Mock<any, any>;
        commitTransaction: jest.Mock<any, any>;
        rollbackTransaction: jest.Mock<any, any>;
        release: jest.Mock<any, any>;
        manager: MockEntityManager;
    };

    const createMockQueryRunner = (): MockQueryRunner => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: createMockEntityManager(),
    });

    type MockEntityManager = Partial<Record<keyof EntityManager, jest.Mock>>;

    const createMockEntityManager = (): MockEntityManager => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        save: jest.fn(() => {}),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        delete: jest.fn(() => {}),
    });

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProjectsController],
            providers: [
                ProjectsService,
                RequirementsService,
                SystemServicesService,
                IterationsService,
                RolesGuard,
                {
                    provide: getRepositoryToken(Project),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(OriginalRequirement),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(FunctionalRequirement),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(SystemService),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(Iteration),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(MergeRequest),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(Issue),
                    useValue: createMockRepository(),
                },
                {
                    provide: getConnectionToken(),
                    useValue: createMockConnection(),
                },
            ],
        }).compile();

        controller = module.get<ProjectsController>(ProjectsController);
        userRepository = module.get<MockRepository>(getRepositoryToken(User));
        mockUserRepository(userRepository);
        projectRepository = module.get<MockRepository>(
            getRepositoryToken(Project),
        );
        mockProjectRepository(projectRepository);
        originalRequirementRepository = module.get<MockRepository>(
            getRepositoryToken(OriginalRequirement),
        );
        mockOriginalRequirementRepository(originalRequirementRepository);
        functionalRequirementRepository = module.get<MockRepository>(
            getRepositoryToken(FunctionalRequirement),
        );
        mockFunctionalRequirementRepository(functionalRequirementRepository);
        systemServiceRepository = module.get<MockRepository>(
            getRepositoryToken(SystemService),
        );
        mockSystemServiceRepository(systemServiceRepository);
        iterationServiceRepository = module.get<MockRepository>(
            getRepositoryToken(Iteration),
        );
        mockIterationRepository(iterationServiceRepository);
        mergeRequestRepository = module.get<MockRepository>(
            getRepositoryToken(MergeRequest),
        );
        mockMergeRequestRepository(mergeRequestRepository);
        issueRepository = module.get<MockRepository>(getRepositoryToken(Issue));
        mockIssueRepository(issueRepository);
        connection = module.get<MockConnection>(getConnectionToken());
        connection.createQueryRunner.mockImplementation(() => {
            const queryRunner = createMockQueryRunner();
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            queryRunner.connect.mockImplementation(() => {});
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            queryRunner.startTransaction.mockImplementation(() => {});
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            queryRunner.commitTransaction.mockImplementation(() => {});
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            queryRunner.rollbackTransaction.mockImplementation(() => {});
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            queryRunner.release.mockImplementation(() => {});
            return queryRunner;
        });
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAllProjects', () => {
        it('should return all projects', async () => {
            const expectedResult = [
                {
                    id: mockProject.id,
                    name: mockProject.name,
                    description: mockProject.description,
                    manager: mockProject.manager.username,
                    developmentEngineers: mockProject.developmentEngineers.map(
                        (user) => {
                            return user.username;
                        },
                    ),
                    systemEngineers: mockProject.systemEngineers.map((user) => {
                        return user.username;
                    }),
                    qualityAssuranceEngineers:
                        mockProject.qualityAssuranceEngineers.map((user) => {
                            return user.username;
                        }),
                    createDate: mockProject.createDate.getTime(),
                    updateDate: mockProject.updateDate.getTime(),
                },
            ];
            const result = await controller.findAllProjects({
                id: 3,
                username: 'LiHua3',
            });
            expect(result).toEqual({
                code: 200,
                data: expectedResult,
            });
        });
        it("should return 001# User's id check failed", async () => {
            await expect(async () => {
                await controller.findAllProjects({
                    id: 0,
                    username: 'LiHua233',
                });
            }).rejects.toThrow(BadRequestException);
        });
        it('should return 002# User ${userId} does not exist', async () => {
            await expect(async () => {
                await controller.findAllProjects({
                    id: 1000,
                    username: 'LiHua233',
                });
            }).rejects.toThrow(NotFoundException);
        });
    });

    describe('findOneProject', () => {
        it('should return a project', async () => {
            const expectedResult = {
                id: mockProject.id,
                name: mockProject.name,
                description: mockProject.description,
                manager: mockProject.manager.username,
                developmentEngineers: mockProject.developmentEngineers.map(
                    (user) => {
                        return user.username;
                    },
                ),
                systemEngineers: mockProject.systemEngineers.map((user) => {
                    return user.username;
                }),
                qualityAssuranceEngineers:
                    mockProject.qualityAssuranceEngineers.map((user) => {
                        return user.username;
                    }),
                createDate: mockProject.createDate.getTime(),
                updateDate: mockProject.updateDate.getTime(),
            };
            const result = await controller.findOneProject(1, {
                id: 1,
                username: 'LiHua',
            });
            expect(result).toEqual({
                code: 200,
                data: expectedResult,
            });
        });
        it('should return 40x', async () => {
            await expect(async () => {
                await controller.findOneProject(2, {
                    id: 1,
                    username: 'LiHua',
                });
            }).rejects.toThrow(NotFoundException);
        });
        it('should return User ${username} is not authorized to access this project', async () => {
            await expect(async () => {
                await controller.findOneProject(1, {
                    id: 1,
                    username: 'LiHua233',
                });
            }).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('createProject', () => {
        it("should return project's id and name", async () => {
            const expectedResult = {
                id: 1,
                name: 'Hello',
            };
            const result = await controller.createProject({
                projectName: 'Hello',
                description: undefined,
                managerName: 'LiHua',
            });
            expect(result).toEqual({
                code: 200,
                data: expectedResult,
            });
        });
        it('should return 40x', async () => {
            await expect(async () => {
                await controller.createProject({
                    projectName: '',
                    description: 'Hello',
                    managerName: 'LiHua',
                });
            }).rejects.toThrow(BadRequestException);
        });
    });

    describe('updateProject', () => {
        it("should return project's id", async () => {
            const result = await controller.updateProject(1, {
                name: 'Hello',
                description: '001',
            });
            expect(result).toEqual({
                code: 200,
                data: 1,
            });
        });
        it("should return 001# Project's name check failed", async () => {
            await expect(async () => {
                await controller.updateProject(1, {
                    name: '',
                    description: '001',
                });
            }).rejects.toThrow(BadRequestException);
        });
    });

    describe('inviteUser', () => {
        it('should return normal', async () => {
            userRepository.save.mockClear();

            const result = await controller.inviteUser(
                {
                    invitedUser: 2,
                    grantedRole: [1, 2],
                },
                1,
            );
            expect(result.code).toBe(200);
            const expected = mockUser2;

            expected.sysProjects.push(mockProject);
            expected.devProjects.push(mockProject);

            expect(userRepository.save).toHaveBeenCalledTimes(1);
            expect(userRepository.save).toHaveBeenCalledWith(expected);
        });

        it('should return normal with duplicated requests', async () => {
            userRepository.save.mockClear();

            const result = await controller.inviteUser(
                {
                    invitedUser: 2,
                    grantedRole: [2, 3, 1, 3, 2, 3, 1, 3, 2],
                },
                1,
            );
            expect(result.code).toBe(200);
            const expected = mockUser2;

            expected.sysProjects.push(mockProject);
            expected.devProjects.push(mockProject);
            expected.qaProjects.push(mockProject);

            expect(userRepository.save).toHaveBeenCalledTimes(1);
            expect(userRepository.save).toHaveBeenCalledWith(expected);
        });

        it('should return 002# User is working for a functional requirement', async () => {
            const result = await controller.inviteUser(
                {
                    invitedUser: 2,
                    grantedRole: [],
                },
                1,
            );
            expect(result.data).toEqual({
                funcIds: [1],
                iterIds: [],
            });
        });

        it('should return 001# User is working for a iteration', async () => {
            const result = await controller.inviteUser(
                {
                    invitedUser: 1,
                    grantedRole: [],
                },
                1,
            );
            expect(result.data).toEqual({
                funcIds: [],
                iterIds: [1],
            });
        });

        it('should return normal with empty request', async () => {
            userRepository.save.mockClear();
            const result = await controller.inviteUser(
                {
                    invitedUser: 104,
                    grantedRole: [],
                },
                1,
            );
            expect(result.code).toBe(200);

            expect(userRepository.save).toHaveBeenCalledTimes(1);
        });

        it('should return abnormal with invalid user', async () => {
            await expect(async () =>
                controller.inviteUser(
                    {
                        invitedUser: 114514,
                        grantedRole: [1, 2],
                    },
                    1,
                ),
            ).rejects.toThrow(BadRequestException);
        });

        it('should return abnormal with invalid project', async () => {
            await expect(async () =>
                controller.inviteUser(
                    {
                        invitedUser: 1,
                        grantedRole: [1, 2],
                    },
                    2,
                ),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAllOriginalRequirements', () => {
        it('should return normal', async () => {
            const result = await controller.findAllOriginalRequirements(1);
            const expectedResult = [
                {
                    id: mockOriginalRequirement.id,
                    name: mockOriginalRequirement.name,
                    description: mockOriginalRequirement.description,
                    projectId: 1,
                    creatorName: mockOriginalRequirement.creatorUsername,
                    functionalRequirementIds:
                        mockOriginalRequirement.functionalRequirements.map(
                            (sr) => {
                                return sr.id;
                            },
                        ),
                    functionalRequirements:
                        mockOriginalRequirement.functionalRequirements.map(
                            (sr) => {
                                return {
                                    id: sr.id,
                                    name: sr.name,
                                    description: sr.description,
                                    state: sr.state,
                                };
                            },
                        ),
                },
                {
                    id: mockOriginalRequirement2.id,
                    name: mockOriginalRequirement2.name,
                    description: mockOriginalRequirement2.description,
                    projectId: 1,
                    creatorName: mockOriginalRequirement2.creatorUsername,
                    functionalRequirementIds:
                        mockOriginalRequirement2.functionalRequirements.map(
                            (sr) => {
                                return sr.id;
                            },
                        ),
                    functionalRequirements:
                        mockOriginalRequirement2.functionalRequirements.map(
                            (sr) => {
                                return {
                                    id: sr.id,
                                    name: sr.name,
                                    description: sr.description,
                                    state: sr.state,
                                };
                            },
                        ),
                },
            ];
            expect(result).toEqual({
                code: 200,
                data: expectedResult,
            });
        });
        it('should return 40x for project not found', async () => {
            await expect(async () =>
                controller.findAllOriginalRequirements(2),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findOneOriginalRequirement', () => {
        it('should return normal', async () => {
            const result = await controller.findOneOriginalRequirement(1, 1);
            const expectedResult = {
                id: mockOriginalRequirement.id,
                name: mockOriginalRequirement.name,
                description: mockOriginalRequirement.description,
                projectId: 1,
                creatorName: mockOriginalRequirement.creatorUsername,
                functionalRequirementIds:
                    mockOriginalRequirement.functionalRequirements.map((sr) => {
                        return sr.id;
                    }),
                functionalRequirements:
                    mockOriginalRequirement.functionalRequirements.map((sr) => {
                        return {
                            id: sr.id,
                            name: sr.name,
                            description: sr.description,
                            state: sr.state,
                        };
                    }),
            };
            expect(result).toEqual({
                code: 200,
                data: expectedResult,
            });
        });
        it('should return 40x for ori not found', async () => {
            await expect(async () =>
                controller.findAllOriginalRequirements(2),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('createOriginalRequirement', () => {
        it('should return normal', async () => {
            const oriDto: OriginalRequirementCreateDto = {
                name: 'IR.003',
                description: 'IR',
            };
            const result = await controller.createOriginalRequirement(
                oriDto,
                1,
                { id: 1, username: 'LiHua' },
            );
            expect(result.code).toBe(200);
        });
        it("should return 001# Requirement's name check failed", async () => {
            const oriDto: OriginalRequirementCreateDto = {
                name: '',
                description: 'IR',
            };
            await expect(
                async () =>
                    await controller.createOriginalRequirement(oriDto, 2, {
                        id: 1,
                        username: 'LiHua',
                    }),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 002# Name ${oriDto.name} duplicates', async () => {
            const oriDto: OriginalRequirementCreateDto = {
                name: 'IR.001',
                description: 'IR',
            };
            await expect(
                async () =>
                    await controller.createOriginalRequirement(oriDto, 1, {
                        id: 1,
                        username: 'LiHua',
                    }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('updateOriginalRequirement', () => {
        it('should return normal', async () => {
            const oriDto: OriginalRequirementUpdateDto = {
                id: 1,
                name: 'IR.001',
                description: 'IR',
            };
            const result = await controller.updateOriginalRequirement(
                1,
                oriDto,
            );
            expect(result.code).toBe(200);
        });
        it('should return 001# original requirement ${oriDto.id} not found', async () => {
            const oriDto: OriginalRequirementUpdateDto = {
                id: 101,
                name: 'IR.001',
                description: 'IR',
            };
            await expect(
                async () =>
                    await controller.updateOriginalRequirement(1, oriDto),
            ).rejects.toThrow(NotFoundException);
        });
        it("should return 002# Requirement's name check failed", async () => {
            const oriDto: OriginalRequirementUpdateDto = {
                id: 1,
                name: '',
                description: 'IR',
            };
            await expect(
                async () =>
                    await controller.updateOriginalRequirement(1, oriDto),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 003# Name ${oriDto.name} duplicates', async () => {
            const oriDto: OriginalRequirementUpdateDto = {
                id: 1,
                name: 'IR.002',
                description: 'IR',
            };
            await expect(
                async () =>
                    await controller.updateOriginalRequirement(1, oriDto),
            ).rejects.toThrow();
        });
        it('should return 004# It is unauthorized to change original requirement ${oriDto.id}', async () => {
            const oriDto: OriginalRequirementUpdateDto = {
                id: 1,
                name: 'IR.001',
                description: 'IR',
            };
            await expect(
                async () =>
                    await controller.updateOriginalRequirement(2, oriDto),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('findAllSystemServices', () => {
        it('should return normal', async () => {
            const expectedResult = [
                {
                    id: mockSystemService.id,
                    name: mockSystemService.name,
                    description: mockSystemService.description,
                    functionalRequirementIds:
                        mockSystemService.functionalRequirements.map(
                            (func) => func.id,
                        ),
                    functionalRequirements:
                        mockSystemService.functionalRequirements.map((sr) => {
                            return {
                                id: sr.id,
                                name: sr.name,
                                description: sr.description,
                                state: sr.state,
                            };
                        }),
                    createDate: mockSystemService.createDate.getTime(),
                    updateTime: mockSystemService.updateDate.getTime(),
                },
                {
                    id: mockSystemService2.id,
                    name: mockSystemService2.name,
                    description: mockSystemService2.description,
                    functionalRequirementIds:
                        mockSystemService2.functionalRequirements.map(
                            (func) => func.id,
                        ),
                    functionalRequirements:
                        mockSystemService2.functionalRequirements.map((sr) => {
                            return {
                                id: sr.id,
                                name: sr.name,
                                description: sr.description,
                                state: sr.state,
                            };
                        }),
                    createDate: mockSystemService2.createDate.getTime(),
                    updateTime: mockSystemService2.updateDate.getTime(),
                },
            ];
            const result = await controller.findAllSystemServices(1);
            expect(result.data).toEqual(expectedResult);
        });
        it('should return 001# Project does not exist', async () => {
            await expect(
                async () => await controller.findAllSystemServices(2),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findOneSystemService', () => {
        it('should return normal', async () => {
            const expectedResult = {
                id: mockSystemService.id,
                name: mockSystemService.name,
                description: mockSystemService.description,
                functionalRequirementIds:
                    mockSystemService.functionalRequirements.map(
                        (func) => func.id,
                    ),
                functionalRequirements:
                    mockSystemService.functionalRequirements.map((sr) => {
                        return {
                            id: sr.id,
                            name: sr.name,
                            description: sr.description,
                            state: sr.state,
                        };
                    }),
                createDate: mockSystemService.createDate.getTime(),
                updateTime: mockSystemService.updateDate.getTime(),
            };
            const result = await controller.findOneSystemService(1, 1);
            expect(result.data).toEqual(expectedResult);
        });
        it('should return 001# System service ${servId} does not exist', async () => {
            await expect(
                async () => await controller.findOneSystemService(1, 3),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return unauthorized', async () => {
            await expect(
                async () => await controller.findOneSystemService(2, 1),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('updateSystemService', () => {
        it('should return normal when creating', async () => {
            const result = await controller.updateSystemService(
                {
                    name: 'System Service #3',
                    description: '003',
                },
                1,
            );
            expect(result.data).toBe(undefined); // no mock 'new SystemService()'
        });
        it('should return normal when updating', async () => {
            const result = await controller.updateSystemService(
                {
                    name: 'System Service #1',
                    newName: 'System Service #5',
                    description: '003',
                },
                1,
            );
            expect(result.data).toBe(1);
        });
        it("should return 001# system service's name check failed", async () => {
            await expect(
                async () =>
                    await controller.updateSystemService(
                        {
                            name: '',
                            newName: 'System Service #3',
                            description: '003',
                        },
                        1,
                    ),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 002# Project does not exist', async () => {
            await expect(
                async () =>
                    await controller.updateSystemService(
                        {
                            name: 'System Service #1',
                            newName: 'System Service #3',
                            description: '003',
                        },
                        2,
                    ),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 003# Create but no description', async () => {
            await expect(
                async () =>
                    await controller.updateSystemService(
                        {
                            name: 'System Service #4',
                            newName: 'System Service #3',
                        },
                        1,
                    ),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 004# New name check failed', async () => {
            await expect(
                async () =>
                    await controller.updateSystemService(
                        {
                            name: 'System Service #2',
                            newName: '',
                            description: '002',
                        },
                        1,
                    ),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 005# New name duplicates', async () => {
            await expect(
                async () =>
                    await controller.updateSystemService(
                        {
                            name: 'System Service #3',
                            newName: 'System Service #2',
                            description: '002',
                        },
                        1,
                    ),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAllFunctionalRequirementsInSystemService', () => {
        it('should return normal', async () => {
            const expectedResult = {
                id: mockFunctionalRequirement.id,
                name: mockFunctionalRequirement.name,
                description: mockFunctionalRequirement.description,
                state: mockFunctionalRequirement.state,
                projectId: 1,
                originalRequirementId:
                    mockFunctionalRequirement.originalRequirement.id,
                distributorId: mockFunctionalRequirement.distributorId,
                developerId: mockFunctionalRequirement.developerId,
                systemServiceId: mockFunctionalRequirement.systemService
                    ? mockFunctionalRequirement.systemService.id
                    : undefined,
                deliveryIterationId: mockFunctionalRequirement.deliveryIteration
                    ? mockFunctionalRequirement.deliveryIteration.id
                    : undefined,
                createDate: mockFunctionalRequirement.createDate.getTime(),
                updateDate: mockFunctionalRequirement.updateDate.getTime(),
            };
            const result =
                await controller.findAllFunctionalRequirementsInSystemService(
                    1,
                    1,
                );
            expect(result).toEqual({
                code: 200,
                data: [expectedResult],
            });
        });
    });

    describe('findOneIteration', () => {
        it('should return normal', async () => {
            const expectedResult = {
                id: mockIteration.id,
                name: mockIteration.name,
                description: mockIteration.description,
                deadline: mockIteration.deadline.getTime(),
                state: mockIteration.state,
                directorUsername: mockIteration.directorUsername,
                functionalRequirementIds:
                    mockIteration.functionalRequirements.map((func) => func.id),
                functionalRequirements:
                    mockIteration.functionalRequirements.map((sr) => {
                        return {
                            id: sr.id,
                            name: sr.name,
                            description: sr.description,
                            state: sr.state,
                        };
                    }),
                createDate: mockIteration.createDate.getTime(),
                updateTime: mockIteration.updateDate.getTime(),
            };
            const result = await controller.findOneIteration(1, 1);
            expect(result.data).toEqual(expectedResult);
        });
        it('should return 001# Iteration ${iterId} does not exist', async () => {
            await expect(
                async () => await controller.findOneIteration(1, 1000),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return UnauthorizedException', async () => {
            await expect(
                async () => await controller.findOneIteration(2, 1),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('findAllIterations', () => {
        it('should return normal', async () => {
            const expectedResult = [
                {
                    id: mockIteration.id,
                    name: mockIteration.name,
                    description: mockIteration.description,
                    deadline: mockIteration.deadline.getTime(),
                    state: mockIteration.state,
                    directorUsername: mockIteration.directorUsername,
                    functionalRequirementIds:
                        mockIteration.functionalRequirements.map(
                            (func) => func.id,
                        ),
                    functionalRequirements:
                        mockIteration.functionalRequirements.map((sr) => {
                            return {
                                id: sr.id,
                                name: sr.name,
                                description: sr.description,
                                state: sr.state,
                            };
                        }),
                    createDate: mockIteration.createDate.getTime(),
                    updateTime: mockIteration.updateDate.getTime(),
                },
            ];
            const result = await controller.findAllIterations(1);
            expect(result.data).toEqual(expectedResult);
        });
        it('should return 001# Project ${projectId} does not exist', async () => {
            await expect(
                async () => await controller.findAllIterations(2),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findIterationsByIds', () => {
        it('should return normal', async () => {
            const expectedResult = [
                {
                    id: mockIteration.id,
                    name: mockIteration.name,
                    description: mockIteration.description,
                    deadline: mockIteration.deadline.getTime(),
                    state: mockIteration.state,
                    directorUsername: mockIteration.directorUsername,
                    functionalRequirementIds:
                        mockIteration.functionalRequirements.map(
                            (func) => func.id,
                        ),
                    createDate: mockIteration.createDate.getTime(),
                    updateTime: mockIteration.updateDate.getTime(),
                },
            ];
            const result = await controller.findIterationsByIds(1, {
                ids: [1],
            });
            expect(result.data).toEqual(expectedResult);
        });
    });

    describe('createIterations', () => {
        it('should return normal when creating', async () => {
            const iterDto: IterationCreateDto = {
                name: 'iter #1',
                description: '001',
                deadline: Date.now() + 10000,
                directorUsername: 'LiHua',
            };
            const result = await controller.createIterations(1, iterDto);
            expect(result.code).toBe(200);
        });
        it('should return normal when updating', async () => {
            const iterDto: IterationCreateDto = {
                id: 1,
                name: 'iter #101',
                description: '001',
                deadline: Date.now() + 10000,
                directorUsername: 'LiHua',
            };
            const result = await controller.createIterations(1, iterDto);
            expect(result.code).toBe(200);
        });
        it("should return 002# Iteration's name check failed", async () => {
            const iterDto: IterationCreateDto = {
                name: '',
                description: '001',
                deadline: Date.now() + 10000,
                directorUsername: 'LiHua',
            };
            await expect(
                async () => await controller.createIterations(1, iterDto),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 003# Earlier DDL', async () => {
            const iterDto: IterationCreateDto = {
                name: 'iter #1',
                description: '001',
                deadline: Date.now() - 10000,
                directorUsername: 'LiHua',
            };
            await expect(
                async () => await controller.createIterations(1, iterDto),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 004# User ${username} does not exist', async () => {
            const iterDto: IterationCreateDto = {
                name: 'iter #1',
                description: '001',
                deadline: Date.now() - 10000,
                directorUsername: 'LiHua2',
            };
            await expect(
                async () => await controller.createIterations(1, iterDto),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 005# Iteration ${iterDto.id} does not exist', async () => {
            const iterDto: IterationCreateDto = {
                id: 1000,
                name: 'iter #1',
                description: '001',
                deadline: Date.now() - 10000,
                directorUsername: 'LiHua',
            };
            await expect(
                async () => await controller.createIterations(1, iterDto),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 006# Name ${iterDto.name} duplicates when creating', async () => {
            const iterDto: IterationCreateDto = {
                name: 'iter #1',
                description: '001',
                deadline: Date.now() - 10000,
                directorUsername: 'LiHua',
            };
            await expect(
                async () => await controller.createIterations(1, iterDto),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 006# Name ${iterDto.name} duplicates when updating', async () => {
            const iterDto: IterationCreateDto = {
                id: 1,
                name: 'iter #1',
                description: '001',
                deadline: Date.now() - 10000,
                directorUsername: 'LiHua',
            };
            await expect(
                async () => await controller.createIterations(1, iterDto),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAllFunctionalRequirementsInIteration', () => {
        it('should return normal', async () => {
            const expectedResult = {
                id: mockFunctionalRequirement.id,
                name: mockFunctionalRequirement.name,
                description: mockFunctionalRequirement.description,
                state: mockFunctionalRequirement.state,
                projectId: 1,
                originalRequirementId:
                    mockFunctionalRequirement.originalRequirement.id,
                distributorId: mockFunctionalRequirement.distributorId,
                developerId: mockFunctionalRequirement.developerId,
                systemServiceId: mockFunctionalRequirement.systemService
                    ? mockFunctionalRequirement.systemService.id
                    : undefined,
                deliveryIterationId: mockFunctionalRequirement.deliveryIteration
                    ? mockFunctionalRequirement.deliveryIteration.id
                    : undefined,
                createDate: mockFunctionalRequirement.createDate.getTime(),
                updateDate: mockFunctionalRequirement.updateDate.getTime(),
            };
            const result =
                await controller.findAllFunctionalRequirementsInIteration(1, 1);
            expect(result).toEqual({
                code: 200,
                data: [expectedResult],
            });
        });
    });

    describe('findAllFunctionalRequirements', () => {
        it('should return normal when finding functional requirements in an original requirement', async () => {
            const expectedResult = {
                id: mockFunctionalRequirement.id,
                name: mockFunctionalRequirement.name,
                description: mockFunctionalRequirement.description,
                state: mockFunctionalRequirement.state,
                projectId: 1,
                originalRequirementId:
                    mockFunctionalRequirement.originalRequirement.id,
                distributorId: mockFunctionalRequirement.distributorId,
                developerId: mockFunctionalRequirement.developerId,
                systemServiceId: mockFunctionalRequirement.systemService
                    ? mockFunctionalRequirement.systemService.id
                    : undefined,
                deliveryIterationId: mockFunctionalRequirement.deliveryIteration
                    ? mockFunctionalRequirement.deliveryIteration.id
                    : undefined,
                createDate: mockFunctionalRequirement.createDate.getTime(),
                updateDate: mockFunctionalRequirement.updateDate.getTime(),
            };
            const result = await controller.findAllFunctionalRequirements(1, 1);
            expect(result.data).toEqual([expectedResult]);
        });
        it('should return normal when finding functional requirements in a project', async () => {
            const expectedResult = {
                id: mockFunctionalRequirement.id,
                name: mockFunctionalRequirement.name,
                description: mockFunctionalRequirement.description,
                state: mockFunctionalRequirement.state,
                projectId: mockFunctionalRequirement.projectId,
                originalRequirementId:
                    mockFunctionalRequirement.originalRequirement.id,
                distributorId: mockFunctionalRequirement.distributorId,
                developerId: mockFunctionalRequirement.developerId,
                systemServiceId: mockFunctionalRequirement.systemService
                    ? mockFunctionalRequirement.systemService.id
                    : undefined,
                deliveryIterationId: mockFunctionalRequirement.deliveryIteration
                    ? mockFunctionalRequirement.deliveryIteration.id
                    : undefined,
                createDate: mockFunctionalRequirement.createDate.getTime(),
                updateDate: mockFunctionalRequirement.updateDate.getTime(),
            };
            const result = await controller.findAllFunctionalRequirements(1, 0);
            expect(result.data).toEqual([expectedResult]);
        });
    });

    describe('findOneFunctionalRequirement', () => {
        it('should return normal', async () => {
            const expectedResult = {
                id: mockFunctionalRequirement.id,
                name: mockFunctionalRequirement.name,
                description: mockFunctionalRequirement.description,
                state: mockFunctionalRequirement.state,
                projectId: 1,
                originalRequirementId:
                    mockFunctionalRequirement.originalRequirement.id,
                distributorId: mockFunctionalRequirement.distributorId,
                developerId: mockFunctionalRequirement.developerId,
                systemServiceId: mockFunctionalRequirement.systemService
                    ? mockFunctionalRequirement.systemService.id
                    : undefined,
                deliveryIterationId: mockFunctionalRequirement.deliveryIteration
                    ? mockFunctionalRequirement.deliveryIteration.id
                    : undefined,
                createDate: mockFunctionalRequirement.createDate.getTime(),
                updateDate: mockFunctionalRequirement.updateDate.getTime(),
            };
            const result = await controller.findOneFunctionalRequirement(1, 1);
            expect(result.data).toEqual(expectedResult);
        });
        it('should return 002# Functional requirement ${funcId} does not exist', async () => {
            await expect(
                async () =>
                    await controller.findOneFunctionalRequirement(1, 101),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return UnauthorizedException', async () => {
            await expect(
                async () => await controller.findOneFunctionalRequirement(2, 1),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('createFunctionalRequirement', () => {
        it('should return normal when creating', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 1,
            };
            const result = await controller.createFunctionalRequirement(
                1,
                funcDto,
                { username: 'LiHua', id: 1 },
            );
            expect(result.code).toBe(200);
        });
        it('should return normal when updating', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: 'SR.001.001',
                description: '001',
                originalRequirementId: 2,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 2,
            };
            const result = await controller.createFunctionalRequirement(
                1,
                funcDto,
                { username: 'LiHua', id: 1 },
            );
            expect(result.code).toBe(200);
        });
        it('should return normal when updating with systemServiceId 0', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: 'SR.001.001',
                description: '001',
                originalRequirementId: 2,
                developerId: 3,
                systemServiceId: 0,
                iterationId: 2,
            };
            const result = await controller.createFunctionalRequirement(
                1,
                funcDto,
                { username: 'LiHua', id: 1 },
            );
            expect(result.code).toBe(200);
        });
        it('should return normal when updating with developerId 0', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: 'SR.001.001',
                description: '001',
                originalRequirementId: 2,
                developerId: 0,
                systemServiceId: 1,
                iterationId: 2,
            };
            const result = await controller.createFunctionalRequirement(
                1,
                funcDto,
                { username: 'LiHua', id: 1 },
            );
            expect(result.code).toBe(200);
        });
        it('should return normal when updating with iterationId 0', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: 'SR.001.001',
                description: '001',
                originalRequirementId: 2,
                developerId: 3,
                systemServiceId: 0,
                iterationId: 2,
            };
            const result = await controller.createFunctionalRequirement(
                1,
                funcDto,
                { username: 'LiHua', id: 1 },
            );
            expect(result.code).toBe(200);
        });
        it("should return 001# Functional requirement's name check failed", async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                name: '',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 002# User ${funcDto.developerId} is not a development engineer', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 104,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(UnauthorizedException);
        });
        it('should return 003# Original requirement ${funcDto.originalRequirementId} does not exist', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1000,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 004# System service ${funcDto.systemServiceId} does not exist', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 3,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 005# Iteration ${funcDto.iterationId} does not exist', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 3,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 006# Functional requirement ${funcDto.id} does not exist', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 3,
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
        it("should return 007# Functional requirement's name check failed", async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: '',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 002# User ${funcDto.developerId} is not a development engineer', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 104,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(UnauthorizedException);
        });
        it('should return 003# New original requirement ${funcDto.originalRequirementId} does not exist', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: 'Func #1',
                description: '001',
                originalRequirementId: 3,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 004# New system service ${funcDto.systemServiceId} does not exist', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 3,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 005# New iteration ${funcDto.iterationId} does not exist', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 1,
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 3,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 009# Name ${funcDto.name} duplicates when creating', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(BadRequestException);
        });
        it('should return 009# Name ${funcDto.name} duplicates when updating', async () => {
            const funcDto: FunctionalRequirementCreateDto = {
                id: 2,
                name: 'Func #1',
                description: '001',
                originalRequirementId: 1,
                developerId: 3,
                systemServiceId: 1,
                iterationId: 1,
            };
            await expect(
                async () =>
                    await controller.createFunctionalRequirement(1, funcDto, {
                        username: 'LiHua',
                        id: 1,
                    }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('deleteFunctionalRequirement', () => {
        it('should return deleted funcId', async () => {
            const result = await controller.deleteFunctionalRequirement(1, {
                id: 1,
            });
            expect(result).toEqual({
                code: 200,
                data: 1,
            });
        });
        it('should return 002# Functional requirement ${funcId} does not exist', async () => {
            await expect(
                async () =>
                    await controller.deleteFunctionalRequirement(1, {
                        id: 101,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('changeFunctionalRequirementState', () => {
        it('should return normal', async () => {
            const result = await controller.changeFunctionalRequirementState(
                1,
                { id: 1, state: 2 },
            );
            expect(result).toEqual({
                code: 200,
                data: 1,
            });
        });
        it('should return 001# Original requirement not found', async () => {
            await expect(
                async () =>
                    await controller.changeFunctionalRequirementState(100, {
                        id: 1,
                        state: 2,
                    }),
            ).rejects.toThrow(UnauthorizedException);
        });
        it('should return 002# Functional requirement ${funcDto.id} does not exist', async () => {
            await expect(
                async () =>
                    await controller.changeFunctionalRequirementState(1, {
                        id: 100,
                        state: 2,
                    }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findFunctionalRequirementsByIds', () => {
        it('should return normal', async () => {
            const expectedResult = {
                id: mockFunctionalRequirement.id,
                name: mockFunctionalRequirement.name,
                description: mockFunctionalRequirement.description,
                state: mockFunctionalRequirement.state,
                projectId: 1,
                originalRequirementId:
                    mockFunctionalRequirement.originalRequirement.id,
                distributorId: mockFunctionalRequirement.distributorId,
                developerId: mockFunctionalRequirement.developerId,
                systemServiceId: mockFunctionalRequirement.systemService
                    ? mockFunctionalRequirement.systemService.id
                    : undefined,
                deliveryIterationId: mockFunctionalRequirement.deliveryIteration
                    ? mockFunctionalRequirement.deliveryIteration.id
                    : undefined,
                createDate: mockFunctionalRequirement.createDate.getTime(),
                updateDate: mockFunctionalRequirement.updateDate.getTime(),
            };
            const result = await controller.findFunctionalRequirementsByIds(1, {
                ids: [1, 2, 3],
            });
            expect(result).toEqual({
                code: 200,
                data: [expectedResult],
            });
        });
    });
});

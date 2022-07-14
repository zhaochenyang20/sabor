import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import {
    createMockRepository,
    mockFunctionalRequirementRepository,
    mockIterationRepository,
    mockOriginalRequirementRepository,
    mockProject,
    mockProjectRepository,
    MockRepository,
    mockSystemServiceRepository,
    mockUserRepository,
} from '../mocks/mock-repository';
import { Project } from './entities/proejct.entity';
import { ProjectsService } from './projects.service';
import { OriginalRequirement } from './entities/originalRequirement.entity';
import { FunctionalRequirement } from './entities/functionalRequirement.entity';
import { RequirementsService } from './requirements.service';
import { SystemServicesService } from './system-services.service';
import { SystemService } from './entities/systemService.entity';
import { Iteration } from './entities/iteration.entity';
import { ProjectsController } from './projects.controller';
import { Connection, EntityManager } from 'typeorm';
import { IterationsService } from './iterations.service';
import { RolesGuard } from '../roles/roles.guard';
import { MergeRequest } from '../git/entities/mergeRequest.entity';
import {
    mockIssueRepository,
    mockMergeRequestRepository,
} from '../mocks/mock-repository-git';
import { Issue } from '../git/entities/issue.entity';

describe('ProjectsService', () => {
    let service: ProjectsService;
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

        service = module.get<ProjectsService>(ProjectsService);
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
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
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
            const projects = await service.findAll(3);
            expect(projects).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
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
            const result = await service.findOne(1, 'LiHua3');
            expect(result).toEqual(expectedResult);
        });
        it('should return 40x for not found', async () => {
            await expect(async () => {
                await service.findOne(2, 'LiHua');
            }).rejects.toThrow();
        });
        it('should return 40x for id check failed', async () => {
            await expect(async () => {
                await service.findOne(0, 'LiHua');
            }).rejects.toThrow();
        });
    });

    describe('create', () => {
        it("should return project's id and name", async () => {
            const expectedResult = {
                id: 1,
                name: 'Hello',
            };
            const result = await service.create({
                projectName: 'Hello',
                description: undefined,
                managerName: 'LiHua',
            });
            expect(result).toEqual(expectedResult);
        });
        it("should return 40x for project's name check failed", async () => {
            await expect(async () => {
                await service.create({
                    projectName: '',
                    description: 'Hello',
                    managerName: 'LiHua',
                });
            }).rejects.toThrow();
        });
        it("should return 40x for manager's name check failed", async () => {
            await expect(async () => {
                await service.create({
                    projectName: 'Hello',
                    description: 'Hello',
                    managerName: '',
                });
            }).rejects.toThrow();
        });
        it('should return 40x for manager not existing', async () => {
            await expect(async () => {
                await service.create({
                    projectName: 'Hello',
                    description: 'Hello',
                    managerName: 'LiXiaoHua', // only 'LiHua' exists
                });
            }).rejects.toThrow();
        });
    });
});

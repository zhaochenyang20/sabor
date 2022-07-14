import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/proejct.entity';
import { User } from '../users/entities/user.entity';
import {
    createMockRepository,
    mockFunctionalRequirementRepository,
    mockIterationRepository,
    mockOriginalRequirementRepository,
    mockProjectRepository,
    MockRepository,
    mockSystemServiceRepository,
    mockUserRepository,
} from '../mocks/mock-repository';
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { OriginalRequirement } from './entities/originalRequirement.entity';
import { FunctionalRequirement } from './entities/functionalRequirement.entity';
import { RequirementsService } from './requirements.service';
import { SystemServicesService } from './system-services.service';
import { SystemService } from './entities/systemService.entity';
import { Iteration } from './entities/iteration.entity';
import { IterationsService } from './iterations.service';
import { RolesGuard } from '../roles/roles.guard';
import { Connection, EntityManager } from 'typeorm';
import {
    mockIssueRepository,
    mockMergeRequestRepository,
} from '../mocks/mock-repository-git';
import { MergeRequest } from '../git/entities/mergeRequest.entity';
import { Issue } from '../git/entities/issue.entity';

describe('ProjectsController', () => {
    let controller: ProjectsController;
    let connection: MockConnection;
    let projectRepository: MockRepository;
    let userRepository: MockRepository;
    let originalRequirementRepository: MockRepository;
    let functionalRequirementRepository: MockRepository;
    let systemServiceRepository: MockRepository;
    let iterationServiceRepository: MockRepository;
    let mergeRequestRepository: MockRepository;
    let issueRepository: MockRepository;

    type MockConnection = Partial<Record<keyof Connection, jest.Mock>>;

    const createMockConnection = (): MockConnection => ({
        createQueryRunner: jest.fn(),
    });

    type MockEntityManager = Partial<Record<keyof EntityManager, jest.Mock>>;

    const createMockEntityManager = (): MockEntityManager => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        save: jest.fn(() => {}),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        delete: jest.fn(() => {}),
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
                    provide: getConnectionToken(),
                    useValue: createMockConnection(),
                },
                {
                    provide: getRepositoryToken(Project),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(User),
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
            ],
        }).compile();

        controller = module.get<ProjectsController>(ProjectsController);
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
        userRepository = module.get<MockRepository>(getRepositoryToken(User));
        mockUserRepository(userRepository);
        projectRepository = module.get<MockRepository>(
            getRepositoryToken(Project),
        );
        mergeRequestRepository = module.get<MockRepository>(
            getRepositoryToken(MergeRequest),
        );
        mockMergeRequestRepository(mergeRequestRepository);
        issueRepository = module.get<MockRepository>(getRepositoryToken(Issue));
        mockIssueRepository(issueRepository);
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
    });
    describe('deleteOriginalRequirement', () => {
        it('should return normal', async () => {
            const result = await controller.deleteOriginalRequirement(1, {
                id: 1,
            });
            expect(result.code).toBe(200);
        });
        it('should return 001# Original requirement not found', async () => {
            await expect(
                async () =>
                    await controller.deleteOriginalRequirement(1, { id: 1000 }),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return UnauthorizedException', async () => {
            await expect(
                async () =>
                    await controller.deleteOriginalRequirement(2, { id: 1 }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('deleteSystemService', () => {
        it('should return normal', async () => {
            const result = await controller.deleteSystemService({ id: 1 }, 1);
            expect(result.code).toBe(200);
        });
        it('should return 001# System service ${servId} does not exist', async () => {
            await expect(
                async () =>
                    await controller.deleteSystemService({ id: 100 }, 1),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 002# Project ${projectId} does not have System service ${servId}', async () => {
            await expect(
                async () => await controller.deleteSystemService({ id: 1 }, 2),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('deleteIteration', () => {
        it('should return normal', async () => {
            const result = await controller.deleteIteration(1, { id: 1 });
            expect(result.code).toBe(200);
        });
        it('should return 001# Iteration ${iterId} does not exist', async () => {
            await expect(
                async () => await controller.deleteIteration(1, { id: 100 }),
            ).rejects.toThrow(NotFoundException);
        });
        it('should return 002# Project ${projectId} does not have Iteration ${iterId}', async () => {
            await expect(
                async () => await controller.deleteIteration(2, { id: 1 }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('deleteProject', () => {
        it('should return normal', async () => {
            const result = await controller.deleteProject(1);
            expect(result.code).toBe(200);
        });
    });
});

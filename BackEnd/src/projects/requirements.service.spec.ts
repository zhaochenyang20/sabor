import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
    createMockRepository,
    mockFunctionalRequirementRepository,
    mockOriginalRequirementRepository,
    MockRepository,
} from '../mocks/mock-repository';
import { User } from '../users/entities/user.entity';
import { Connection } from 'typeorm';
import { FunctionalRequirement } from './entities/functionalRequirement.entity';
import { Iteration } from './entities/iteration.entity';
import { OriginalRequirement } from './entities/originalRequirement.entity';
import { Project } from './entities/proejct.entity';
import { SystemService } from './entities/systemService.entity';
import { RequirementsService } from './requirements.service';
import { MergeRequest } from '../git/entities/mergeRequest.entity';
import { mockMergeRequestRepository } from '../mocks/mock-repository-git';

describe('requirement service', () => {
    let requirementService: RequirementsService;
    let mergeRequestRepository: MockRepository;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RequirementsService,
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
                    provide: Connection,
                    useValue: {},
                },
            ],
        }).compile();
        const funcRepo = module.get<MockRepository>(
            getRepositoryToken(FunctionalRequirement),
        );
        mockFunctionalRequirementRepository(funcRepo);
        const oriRepoe = module.get<MockRepository>(
            getRepositoryToken(OriginalRequirement),
        );
        mockOriginalRequirementRepository(oriRepoe);
        requirementService =
            module.get<RequirementsService>(RequirementsService);
        mergeRequestRepository = module.get<MockRepository>(
            getRepositoryToken(MergeRequest),
        );
        mockMergeRequestRepository(mergeRequestRepository);
    });

    describe('validate Functional Requests', () => {
        it('should return ok', async () => {
            const res = await requirementService.validateFunctionalRequest(
                1,
                1,
            );
            expect(res).not.toBeNull();
        });
        it('should return failed', async () => {
            const res = await requirementService.validateFunctionalRequest(
                1,
                3,
            );
            expect(res).toBeNull();
        });
        it('should also return failed', async () => {
            const res = await requirementService.validateFunctionalRequest(
                2,
                1,
            );
            expect(res).toBeNull();
        });
    });
});

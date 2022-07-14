import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateAppleDto } from './dto/create-apple.dto';
import { Apple } from './entites/apple.entity';
import { PingService } from './ping.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

describe('PingService', () => {
    let service: PingService;
    let appleRepository: MockRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PingService,
                {
                    provide: Connection,
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(Apple),
                    useValue: createMockRepository(),
                },
            ],
        }).compile();
        service = module.get<PingService>(PingService);
        appleRepository = module.get<MockRepository>(getRepositoryToken(Apple));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all apples', async () => {
            const expectedResult = [{ id: 1, name: 'red' }];
            appleRepository.find.mockReturnValue(expectedResult);
            const apples = await service.findAll();
            expect(apples).toEqual(expectedResult);
        });
    });

    describe('create', () => {
        it('should return id and name', async () => {
            const expectedResult = { id: 1, name: 'hello' };
            const param: CreateAppleDto = new CreateAppleDto();
            param.name = 'hello';
            const apple: Apple = { id: 1, name: 'hello' };
            appleRepository.create.call([param]);
            appleRepository.create.mockReturnValue(apple);
            appleRepository.save.call([apple]);
            appleRepository.save.mockReturnValue(apple);
            const result = await service.create(param);
            expect(result).toEqual(expectedResult);
        });
    });
});

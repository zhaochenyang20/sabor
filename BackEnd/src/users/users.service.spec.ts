import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
    createMockRepository,
    MockRepository,
    mockUserRepository,
} from '../mocks/mock-repository';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UserService', () => {
    let service: UsersService;
    let userRepository: MockRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.register({})],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: createMockRepository(),
                },
            ],
        }).compile();
        service = module.get<UsersService>(UsersService);
        userRepository = module.get<MockRepository>(getRepositoryToken(User));
        mockUserRepository(userRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const expectedResult = [
                {
                    id: 1,
                    username: 'LiHua',
                },
            ];
            const users = await service.findAll();
            expect(users).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return id and username', async () => {
            const expectedResult = {
                id: 1,
                username: 'LiHua',
                description: '',
                ownProjectIds: [],
                sysProjectIds: [],
                devProjectIds: [1],
                qaProjectIds: [],
            };
            const result = await service.findOne({ username: 'LiHua' });
            expect(result).toEqual(expectedResult);
        });
        it("should return 40x for username check's fail", async () => {
            await expect(async () => {
                await service.findOne({
                    username: '',
                });
            }).rejects.toThrow();
        });
        it('should return 40x for user not being found', async () => {
            await expect(async () => {
                await service.findOne({
                    username: 'LiXiaoHua',
                });
            }).rejects.toThrow();
        });
    });

    describe('register', () => {
        it('should return success', async () => {
            const expectedResult = 'Registration success';
            const result = await service.register({
                username: 'LiHua2',
                password: '123456',
            });
            expect(result).toEqual(expectedResult);
        });
        it("should return 40x for username check's fail", async () => {
            await expect(async () => {
                await service.register({
                    username: '',
                    password: '123456',
                });
            }).rejects.toThrow();
        });
        it("should return 40x for password check's fail", async () => {
            await expect(async () => {
                await service.register({
                    username: 'LiHua',
                    password: '',
                });
            }).rejects.toThrow();
        });
        it('should return 40x for user existing', async () => {
            await expect(async () => {
                await service.register({
                    username: 'LiHua',
                    password: '123456',
                });
            }).rejects.toThrow();
        });
    });
});

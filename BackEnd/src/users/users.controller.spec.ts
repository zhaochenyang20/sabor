import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserFindOneDto } from './dto/user-findOne.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import {
    createMockRepository,
    mockProjectRepository,
    MockRepository,
    mockUserRepository,
} from '../mocks/mock-repository';
import { Project } from '../projects/entities/proejct.entity';
import { UserInfoDto } from './dto/user-info.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';

describe('UsersController', () => {
    let controller: UsersController;
    let userRepository: MockRepository;
    let projectRepository: MockRepository;
    const testPassword = '(*E$WU(*3298nfjio(WE(*F7s&*WE%FE^';

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.register({ secret: 'R.I.P. For MU5735' })],
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(Project),
                    useValue: createMockRepository(),
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        userRepository = module.get<MockRepository>(getRepositoryToken(User));
        mockUserRepository(userRepository);
        projectRepository = module.get<MockRepository>(
            getRepositoryToken(Project),
        );
        mockProjectRepository(projectRepository);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAllUsers', () => {
        it('should return all users', async () => {
            const expectedResult = [
                {
                    id: 1,
                    username: 'LiHua',
                },
            ];
            const result = await controller.findAllUsers();
            expect(result).toEqual({
                code: 200,
                data: expectedResult,
            });
        });
    });

    describe('findOneUser', () => {
        describe('user exists', () => {
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
                const param: UserFindOneDto = { username: 'LiHua' };
                const result = await controller.findOneUser(param);
                expect(result).toEqual({ code: 200, data: expectedResult });
            });
        });
    });

    describe('register', () => {
        describe('right param', () => {
            it('should return success', async () => {
                const expectedResult = 'Registration success';
                const dto: UserRegisterDto = {
                    username: 'LiHua2',
                    password: '123456',
                };
                const result = await controller.register(dto);
                expect(result).toEqual({ code: 200, data: expectedResult });
            });
        });
    });

    describe('login', () => {
        it('should return success', () => {
            const user: UserInfoDto = {
                username: 'LiHua',
                id: 1,
            };
            let res = controller.login(user);
            expect(res.code).toBe(200);
            res = controller.testLogin(user);
            expect(res.code).toBe(200);
        });
    });

    describe('changePassword', () => {
        const user: UserInfoDto = {
            username: 'LiHua',
            id: 1,
        };
        it('should return success', async () => {
            const data: UserChangePasswordDto = {
                oldPassword: testPassword,
                newPassword: '654321',
            };
            const res = await controller.changePassword(user, data);
            expect(res.code).toBe(200);
        });
        it('should return failure', async () => {
            await expect(
                async () =>
                    await controller.changePassword(user, {
                        oldPassword: '123456',
                        newPassword: '654321',
                    }),
            ).rejects.toThrow();
            await expect(
                async () =>
                    await controller.changePassword(user, {
                        oldPassword: testPassword,
                        newPassword: '',
                    }),
            ).rejects.toThrow();
        });
    });
});

import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
    createMockRepository,
    mockProjectRepository,
    MockRepository,
    mockUserRepository,
} from '../mocks/mock-repository';
import { Project } from '../projects/entities/proejct.entity';
import { User } from '../users/entities/user.entity';
import { Role } from './roles.enum';
import { RolesGuard } from './roles.guard';

const mockReflector = {
    getAllAndOverride: jest
        .fn()
        .mockReturnValue([
            Role.Manager,
            Role.DevelopmentEngineer,
            Role.QualityAssuranceEngineer,
            Role.SystemEngineer,
        ]),
};
const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest
            .fn()
            .mockReturnValueOnce({
                // 1
                user: {
                    id: 1,
                    username: 'LiHua',
                },
                params: {
                    id: '1',
                },
            })
            .mockReturnValueOnce({
                // 2
                user: {
                    id: 1,
                    username: 'LiHua',
                },
                params: {
                    id: 1,
                },
            })
            .mockReturnValueOnce({
                // 3
                params: {
                    id: '1',
                },
            })
            .mockReturnValueOnce({
                // 4
                user: {
                    id: 1,
                    username: 'LiHua',
                },
                params: {
                    id: 'AwD',
                },
            })
            .mockReturnValueOnce({
                // 5
                user: {
                    id: 1,
                    username: 'LiHua',
                },
                params: {
                    id: 2,
                },
            })
            .mockReturnValueOnce({
                // 6
                user: {
                    id: 2,
                    username: 'Zhangsan',
                },
                params: {
                    id: 1,
                },
            })
            .mockReturnValueOnce({
                // 7
                user: {
                    username: 'Zhangsan',
                },
                params: {
                    id: 1,
                },
            }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
};

describe('role-guard', () => {
    let guard: RolesGuard;
    let projectRepository: MockRepository;
    let userRepository: MockRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
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
                    provide: Reflector,
                    useValue: mockReflector,
                },
            ],
        }).compile();

        guard = module.get<RolesGuard>(RolesGuard);
        userRepository = module.get<MockRepository>(getRepositoryToken(User));
        mockUserRepository(userRepository);
        projectRepository = module.get<MockRepository>(
            getRepositoryToken(Project),
        );
        mockProjectRepository(projectRepository);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('1 - should run ok', async () => {
        expect(await guard.canActivate(mockExecutionContext)).toBe(true);
    });
    it('2 - should also run ok', async () => {
        expect(await guard.canActivate(mockExecutionContext)).toBe(true);
    });
    it('3 - should return user not found', async () => {
        await expect(() =>
            guard.canActivate(mockExecutionContext),
        ).rejects.toThrow(UnauthorizedException);
    });
    it('4 - should return invalid params', async () => {
        await expect(() =>
            guard.canActivate(mockExecutionContext),
        ).rejects.toThrow(BadRequestException);
    });
    it('5 - should return project not found', async () => {
        await expect(() =>
            guard.canActivate(mockExecutionContext),
        ).rejects.toThrow(NotFoundException);
    });
    it('6 - should return false', async () => {
        expect(await guard.canActivate(mockExecutionContext)).toBe(false);
    });
    it('7 - should return invalid user id', async () => {
        await expect(() =>
            guard.canActivate(mockExecutionContext),
        ).rejects.toThrow(InternalServerErrorException);
    });
});

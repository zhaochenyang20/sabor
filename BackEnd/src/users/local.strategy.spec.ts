import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserFindOneDto } from './dto/user-findOne.dto';
import { User } from './entities/user.entity';
import { LocalStrategy } from './local.strategy';
import { UsersService } from './users.service';
import { encryptPassword, makeSalt } from '../utils/cryptogram';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Mocking database
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

describe('Local Strategy', () => {
    let localStrategy: LocalStrategy;
    let userRepository: MockRepository;
    let testPassword: string;
    let testSalt: string;

    beforeAll(() => {
        testPassword = '(*E$WU(*3298nfjio(WE(*F7s&*WE%FE^';
        testSalt = makeSalt();
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.register({})],
            providers: [
                UsersService,
                LocalStrategy,
                {
                    provide: Connection,
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: createMockRepository(),
                },
            ],
        }).compile();

        localStrategy = module.get<LocalStrategy>(LocalStrategy);
        userRepository = module.get<MockRepository>(getRepositoryToken(User));
        userRepository.find.mockImplementation(() => {
            return [];
        });
        userRepository.findOne.mockImplementation(
            (userFindOneDto: UserFindOneDto) => {
                if (userFindOneDto.username === 'LiHua') {
                    return {
                        id: 1,
                        username: 'LiHua',
                        password: encryptPassword(testPassword, testSalt),
                        salt: testSalt,
                    };
                } else {
                    return undefined;
                }
            },
        );
    });

    it('should be defined', () => {
        expect(localStrategy).toBeDefined();
    });

    it('should return OK when typing correct password', async () => {
        expect(await localStrategy.validate('LiHua', testPassword)).toEqual({
            id: 1,
            username: 'LiHua',
        });
    });

    it('shoule return abormal when typing incorrect username or incorrect password', async () => {
        const fakePassword = "TAOfVueHaven'tDoneAVeryGoodJob";

        // Way to check a Promise to Throw
        await expect(
            async () => await localStrategy.validate('ZhangSan', testPassword),
        ).rejects.toThrow(UnauthorizedException);
        await expect(
            async () => await localStrategy.validate('LiHua', fakePassword),
        ).rejects.toThrow(UnauthorizedException);
        await expect(
            async () => await localStrategy.validate('ZhangSan', fakePassword),
        ).rejects.toThrow(UnauthorizedException);

        // Some strange case
        await expect(
            async () => await localStrategy.validate('', testPassword),
        ).rejects.toThrow(UnauthorizedException);
        await expect(
            async () => await localStrategy.validate('ZhangSan', ''),
        ).rejects.toThrow(UnauthorizedException);
    });
});

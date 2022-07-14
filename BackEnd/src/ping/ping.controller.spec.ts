import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateAppleDto } from './dto/create-apple.dto';
import { Apple } from './entites/apple.entity';
import { PingController } from './ping.controller';
import { PingService } from './ping.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

describe('PingController', () => {
    let controller: PingController;
    let appleRepository: MockRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PingController],
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

        controller = module.get<PingController>(PingController);
        appleRepository = module.get<MockRepository>(getRepositoryToken(Apple));
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getPing', () => {
        it('should return "Hello from server side"', () => {
            expect(controller.getPing()).toEqual({
                code: 200,
                data: 'Hello from server side!',
            });
        });
    });

    describe('getPong', () => {
        it('should return OK when sending "ping"', () => {
            expect(controller.postPing('ping')).toEqual({
                code: 200,
                data: 'pong',
            });
        });
        it('should return failed when sending other messages', () => {
            // According to the document,
            // the function that throws an exception needs to be invoked within a wrapping function otherwise the `toThrow` assertion will fail.
            expect(() => controller.postPing('lalala')).toThrow(
                BadRequestException,
            );
        });
    });

    describe('getApple', () => {
        it('should return all apples', async () => {
            const expectedResult = [];
            appleRepository.find.mockReturnValue(expectedResult);
            const result = await controller.getApple();
            expect(result).toEqual({ code: 200, data: expectedResult });
        });
    });

    describe('postApple', () => {
        describe('right param (name)', () => {
            it('should return id and name', async () => {
                const expectedResult = {
                    id: 1,
                    name: 'hello',
                };
                const param: CreateAppleDto = new CreateAppleDto();
                param.name = 'hello';
                const apple: Apple = { id: 1, name: 'hello' };
                appleRepository.create.call([param]);
                appleRepository.create.mockReturnValue(apple);
                appleRepository.save.call([apple]);
                appleRepository.save.mockReturnValue(apple);
                const result = await controller.postApple(param);
                expect(result).toEqual({ code: 200, data: expectedResult });
            });
        });
    });
});

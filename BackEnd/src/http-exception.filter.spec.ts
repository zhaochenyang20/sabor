import { HttpExceptionFilter } from './http-exception.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException, BadRequestException } from '@nestjs/common';

// Reference: https://stackoverflow.com/questions/59205129/jest-unit-test-for-nodejs-nestjs-exceptionfilter-catch-method

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: jest.fn(),
}));

const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
};

describe('HttpExceptionFilter', () => {
    let service: HttpExceptionFilter;
    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [HttpExceptionFilter],
        }).compile();
        service = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    });

    it('should be defined', () => {
        expect(new HttpExceptionFilter()).toBeDefined();
    });

    it('Http exception', () => {
        service.catch(
            new HttpException('Http exception', HttpStatus.BAD_REQUEST),
            mockArgumentsHost,
        );

        expect(mockHttpArgumentsHost).toBeCalledTimes(1);
        expect(mockHttpArgumentsHost).toBeCalledWith();
        expect(mockGetResponse).toBeCalledTimes(1);
        expect(mockGetResponse).toBeCalledWith();
        expect(mockStatus).toBeCalledTimes(1);
        expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockJson).toBeCalledTimes(1);
        expect(mockJson).toBeCalledWith({
            code: 400,
            data: 'Http exception',
        });
    });

    it('should work normal with standard exception with message', () => {
        mockHttpArgumentsHost.mockClear();
        mockGetResponse.mockClear();
        mockStatus.mockClear();
        mockJson.mockClear();

        service.catch(
            new BadRequestException('Http exception'),
            mockArgumentsHost,
        );

        expect(mockHttpArgumentsHost).toBeCalledTimes(1);
        expect(mockHttpArgumentsHost).toBeCalledWith();
        expect(mockGetResponse).toBeCalledTimes(1);
        expect(mockGetResponse).toBeCalledWith();
        expect(mockStatus).toBeCalledTimes(1);
        expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockJson).toBeCalledTimes(1);
        expect(mockJson).toBeCalledWith({
            code: 400,
            data: 'Http exception',
        });
    });

    it('should work normal with self generated object', () => {
        mockHttpArgumentsHost.mockClear();
        mockGetResponse.mockClear();
        mockStatus.mockClear();
        mockJson.mockClear();

        service.catch(
            new BadRequestException({ code: -1, info: 'message' }),
            mockArgumentsHost,
        );

        expect(mockHttpArgumentsHost).toBeCalledTimes(1);
        expect(mockHttpArgumentsHost).toBeCalledWith();
        expect(mockGetResponse).toBeCalledTimes(1);
        expect(mockGetResponse).toBeCalledWith();
        expect(mockStatus).toBeCalledTimes(1);
        expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockJson).toBeCalledTimes(1);
        expect(mockJson).toBeCalledWith({
            code: 400,
            data: {
                code: -1,
                info: 'message',
            },
        });
    });

    it('should work normal with self generated array', () => {
        mockHttpArgumentsHost.mockClear();
        mockGetResponse.mockClear();
        mockStatus.mockClear();
        mockJson.mockClear();

        service.catch(
            new BadRequestException([2, 3, 3, 3, 3]),
            mockArgumentsHost,
        );

        expect(mockHttpArgumentsHost).toBeCalledTimes(1);
        expect(mockHttpArgumentsHost).toBeCalledWith();
        expect(mockGetResponse).toBeCalledTimes(1);
        expect(mockGetResponse).toBeCalledWith();
        expect(mockStatus).toBeCalledTimes(1);
        expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockJson).toBeCalledTimes(1);
        expect(mockJson).toBeCalledWith({
            code: 400,
            data: [2, 3, 3, 3, 3],
        });
    });
});

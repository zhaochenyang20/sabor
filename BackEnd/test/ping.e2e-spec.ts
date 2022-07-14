import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PingModule } from './../src/ping/ping.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '../src/http-exception.filter';

describe('PingController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                PingModule,
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'testdb.ping',
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    });

    it('/api/ping (GET)', () => {
        return request(app.getHttpServer())
            .get('/api/ping')
            .expect((res) => {
                expect(res.body).toEqual(
                    expect.objectContaining({
                        code: 200,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        data: expect.any(String),
                    }),
                );
            });
    });
    describe('/api/ping (POST)', () => {
        it('should return normal', () => {
            return request(app.getHttpServer())
                .post('/api/ping')
                .send({ msg: 'ping' })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            code: 200,
                            data: 'pong',
                        }),
                    );
                });
        });

        it('should return abnormal', () => {
            return request(app.getHttpServer())
                .post('/api/ping')
                .send({ msg: 'ababab' })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            code: 400,
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            data: expect.any(String),
                        }),
                    );
                });
        });

        it('should also return abnormal', () => {
            return request(app.getHttpServer())
                .post('/api/ping')
                .send({})
                .expect(400)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            code: 400,
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            data: expect.any(String),
                        }),
                    );
                });
        });
    });

    it('/api/ping/apple (GET)', () => {
        return request(app.getHttpServer())
            .get('/api/ping/apple')
            .expect((res) => {
                expect(res.body).toEqual({
                    code: 200,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    data: expect.any(Array),
                });
            });
    });

    describe('api/ping/apple (POST)', () => {
        it('should return normal', () => {
            return request(app.getHttpServer())
                .post('/api/ping/apple')
                .send({ name: 'red' })
                .expect((res) => {
                    expect(res.body).toEqual({
                        code: 200,
                        data: {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            id: expect.any(Number),
                            name: 'red',
                        },
                    });
                });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

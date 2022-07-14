import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '../src/http-exception.filter';
import { UsersModule } from '../src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { GitModule } from '../src/git/git.module';

describe('UsersModule (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [
                        () => ({
                            JWT_TOKEN: 'test12345',
                        }),
                    ],
                    isGlobal: true,
                }),
                UsersModule,
                GitModule,
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'testdb.users',
                    autoLoadEntities: true,
                    synchronize: true,
                    dropSchema: true, // Auto-delete origin database when connecting
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter());
        // Validation
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
                transformOptions: {
                    enableImplicitConversion: false,
                },
            }),
        );

        await app.init();
    });

    it('/api/users/find (GET)', () => {
        return request(app.getHttpServer())
            .get('/api/users/find')
            .expect((res) => {
                expect(res.body).toEqual(
                    expect.objectContaining({
                        code: 200,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        data: expect.any(Array),
                    }),
                );
            });
    });

    describe('api/users/find (POST)', () => {
        it('should return abnormal', () => {
            return request(app.getHttpServer())
                .post('/api/users/find')
                .send({ username: 'LiHua' })
                .expect((res) => {
                    expect(res.body).toEqual({
                        code: 404,
                        data: 'User LiHua not found',
                    });
                });
        });
    });

    const userData = { username: 'LiHua', password: '123456' };

    describe('api/users/register (POST)', () => {
        it('should return normal', () => {
            return request(app.getHttpServer())
                .post('/api/users/register')
                .send(userData)
                .expect((res) => {
                    expect(res.body).toEqual({
                        code: 200,
                        data: 'Registration success',
                    });
                });
        });
    });

    describe('/api/users/login', () => {
        describe('Normal login', () => {
            let userToken = '';
            it('should successfully login', () => {
                return request(app.getHttpServer())
                    .post('/api/users/login')
                    .send(userData)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).toEqual({
                            code: 200,
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            data: expect.any(String),
                        });
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        userToken = res.body.data;
                    });
            });
            it("shouldn't be empty", () => {
                expect(userToken).not.toBeFalsy();
            });

            it('should successfully authenticate', () => {
                return request(app.getHttpServer())
                    .get('/api/users/testLogin')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);
            });

            it('should not allow to access', () => {
                return request(app.getHttpServer())
                    .get('/api/users/testLogin')
                    .expect(401);
            });
        });

        test.each([
            [
                {
                    username: 'zhangsan',
                    password: '123456',
                },
            ],
            [
                {
                    username: 'LiHua',
                    password: '654321',
                },
            ],
            [
                {
                    username: 'lihua',
                    password: '654321',
                },
            ],
            [
                {
                    username: '',
                    password: '123456',
                },
            ],
            [
                {
                    username: 'LiHua',
                    password: '',
                },
            ],
            [
                {
                    username: 'LiHua',
                },
            ],
            [
                {
                    user: 'LiHua',
                    password: '123456',
                },
            ],
            [
                {
                    username: { name: 'LiHua' },
                    password: '123456',
                },
            ],
            [
                {
                    username: 'LiHua; DROP TABLE *',
                    password: '1235||true',
                },
            ],
            [
                {
                    username: 'LiHua',
                    password: 123456,
                },
            ],
        ])('should not allow login with request %j', (data) => {
            return request(app.getHttpServer())
                .post('/api/users/login')
                .send(data)
                .expect((res) => {
                    expect(res.status).toBeGreaterThanOrEqual(400);
                    expect(res.status).toBeLessThan(500);
                });
        });

        describe('api/users/changePassword', () => {
            const newPassword = '654321';
            let token: string;
            it('should be normal', () => {
                return request(app.getHttpServer())
                    .post('/api/users/login')
                    .send(userData)
                    .expect((res) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        token = res.body.data;
                    });
            });

            it('should not allow to change password without token', () => {
                return request(app.getHttpServer())
                    .post('/api/users/changePassword')
                    .send({
                        oldPassword: userData.password,
                        newPassword: newPassword,
                    })
                    .expect(401);
            });
            it('should not allow to change password with wrong pass', () => {
                return request(app.getHttpServer())
                    .post('/api/users/changePassword')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        oldPassword: userData.password + 'qwq',
                        newPassword: newPassword,
                    })
                    .expect(401);
            });
            it('should allow to change password', () => {
                return request(app.getHttpServer())
                    .post('/api/users/changePassword')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        oldPassword: userData.password,
                        newPassword: newPassword,
                    })
                    .expect(201);
            });
            it('should allow to login with new password', () => {
                return request(app.getHttpServer())
                    .post('/api/users/login')
                    .send({
                        username: userData.username,
                        password: newPassword,
                    })
                    .expect(201);
            });
            it('should not allow to login with old password', () => {
                return request(app.getHttpServer())
                    .post('/api/users/login')
                    .send(userData)
                    .expect(401);
            });
        });
    });
    afterAll(async () => {
        await app.close();
    });
});

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '../src/http-exception.filter';
import { ProjectsModule } from '../src/projects/projects.module';
import { ProjectCreateDto } from '../src/projects/dto/project-create.dto';
import { UsersModule } from '../src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { GitModule } from '../src/git/git.module';

describe('ProjectsModule (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ProjectsModule,
                UsersModule,
                GitModule,
                ConfigModule.forRoot({
                    load: [
                        () => ({
                            JWT_TOKEN: 'test12345',
                        }),
                    ],
                    isGlobal: true,
                }),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'testdb.projects',
                    autoLoadEntities: true,
                    synchronize: true,
                    dropSchema: true,
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

    let userToken = '';
    const userData = { username: 'LiHua', password: '123456' };
    describe('pre register and login', () => {
        it('register', () => {
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
        it('login', () => {
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
    });

    describe('/api/projects/find-all (GET)', () => {
        it('should return all projects', () => {
            return request(app.getHttpServer())
                .get('/api/projects/find-all')
                .set('Authorization', `Bearer ${userToken}`)
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
    });

    describe('/api/projects/create (POST)', () => {
        describe('normal request', () => {
            it('pre register', () => {
                return request(app.getHttpServer())
                    .post('/api/users/register')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({ username: 'LiHua', password: '123456' });
            });
            it('should return id and name', () => {
                const data: ProjectCreateDto = {
                    projectName: 'Hello',
                    managerName: 'LiHua',
                    description: '',
                };
                return request(app.getHttpServer())
                    .post('/api/projects/create')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send(data)
                    .expect((res) => {
                        expect(res.body).toEqual(
                            expect.objectContaining({
                                code: 200,
                                data: {
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    id: expect.any(Number),
                                    name: 'Hello',
                                },
                            }),
                        );
                    });
            });
        });
        describe('bad request', () => {
            test.each([
                [
                    {
                        projectName: 'P1',
                        managerName: 123456,
                    },
                ],
                [
                    {
                        projectName: 123465,
                        managerName: 'M1',
                    },
                ],
                [
                    {
                        projectName: '',
                        managerName: 'M1',
                    },
                ],
                [
                    {
                        projectName: 'P1',
                        managerName: '',
                        description: 'D1',
                    },
                ],
                [
                    {
                        projectName: 'LiHua',
                        description: '',
                    },
                ],
            ])('should return 40x', (data) => {
                return request(app.getHttpServer())
                    .post('/api/projects/create')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send(data)
                    .expect((res) => {
                        expect(res.status).toBeGreaterThanOrEqual(400);
                    });
            });
        });
    });

    describe('/api/projects/find-one (GET)', () => {
        it('should return correct project', () => {
            return request(app.getHttpServer())
                .get('/api/projects/1/find-one')
                .set('Authorization', `Bearer ${userToken}`)
                .expect((res) => {
                    expect(res.body).toEqual({
                        code: 200,
                        data: {
                            id: 1,
                            name: 'Hello',
                            description: '',
                            manager: 'LiHua',
                            developmentEngineers: [],
                            systemEngineers: [],
                            qualityAssuranceEngineers: [],
                        },
                    });
                });
        });
        it('should return 40x', () => {
            return request(app.getHttpServer())
                .get('/api/projects/find-one')
                .set('Authorization', `Bearer ${userToken}`)
                .query({ id: 0 })
                .expect((res) => {
                    expect(res.status).toBeGreaterThanOrEqual(400);
                });
        });
    });

    describe('/api/projects/:id/invite (POST)', () => {
        beforeAll(async () => {
            // Register more users for testing
            for (const user of [
                { username: 'test1', password: '123456' },
                { username: 'test2', password: '654321' },
                { username: 'test3', password: '135791' },
                { username: 'test4', password: '246802' },
            ]) {
                await request(app.getHttpServer())
                    .post('/api/users/register')
                    .send(user);
            }
        });
        test.each([
            [{ invitedUser: 2, grantedRole: [1, 2] }],
            [{ invitedUser: 3, grantedRole: [1] }],
            [{ invitedUser: 4, grantedRole: [1, 3, 2, 3, 1, 3] }],
            [{ invitedUser: 5, grantedRole: [] }],
            [{ invitedUser: 3, grantedRole: [1, 3] }],
        ])('should return normal with %j', (data) => {
            return request(app.getHttpServer())
                .post('/api/projects/1/invite')
                .set('Authorization', `Bearer ${userToken}`)
                .send(data)
                .expect(201);
        });

        it('should return right info about roles', () => {
            return request(app.getHttpServer())
                .get('/api/projects/1/find-one')
                .set('Authorization', `Bearer ${userToken}`)
                .send()
                .expect((res) => {
                    expect(res.body).toEqual({
                        code: 200,
                        /* eslint-disable @typescript-eslint/no-unsafe-assignment*/
                        data: expect.objectContaining({
                            systemEngineers: expect.arrayContaining([
                                'test1',
                                'test2',
                                'test3',
                            ]),
                            developmentEngineers: expect.arrayContaining([
                                'test1',
                                'test3',
                            ]),
                            qualityAssuranceEngineers: expect.arrayContaining([
                                'test2',
                                'test3',
                            ]),
                        }),
                        /* eslint-enable */
                    });
                });
        });

        test.each([
            [{ invitedUser: '1', grantedRole: [1, 2, 3] }, 400],
            [{ invitedUser: 1, grantedRole: {} }, 400],
            [{ invitedUser: {}, grantedRole: [] }, 400],
            [{ invitedUser: 0.1, grantedRole: [] }, 400],
            [{ invitedUser: 114514, grantedRole: [] }, 400],
            [{ invitedUser: 1 }, 400],
            [{ grantedRole: [] }, 400],
        ])('should return abnormal with %j', (data, code) => {
            return request(app.getHttpServer())
                .post('/api/projects/1/invite')
                .set('Authorization', `Bearer ${userToken}`)
                .send(data)
                .expect(code);
        });

        it('should return 404 with invalid id', () => {
            return request(app.getHttpServer())
                .post('/api/projects/114514/invite')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ invitedUser: 1, grantedRole: [] })
                .expect(404);
        });
        it('should return 400 with invalid id', () => {
            return request(app.getHttpServer())
                .post('/api/projects/fff/invite')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ invitedUser: 1, grantedRole: [] })
                .expect(400);
        });
        it('should return 401 without auth.', () => {
            return request(app.getHttpServer())
                .post('/api/projects/1/invite')
                .send({ invitedUser: 1, grantedRole: [] })
                .expect(401);
        });

        it('should return 403 without permission', async () => {
            let otherToken = '';
            const res = await request(app.getHttpServer())
                .post('/api/users/login')
                .send({ username: 'test1', password: '123456' });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            otherToken = res.body.data;
            expect(otherToken).not.toEqual('');
            return request(app.getHttpServer())
                .post('/api/projects/1/invite')
                .set('Authorization', `Bearer ${otherToken}`)
                .send({ invitedUser: 1, grantedRole: [] })
                .expect(403);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

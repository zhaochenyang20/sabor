// This file is only used for test

import { UserFindOneDto } from '../users/dto/user-findOne.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { encryptPassword, makeSalt } from '../utils/cryptogram';
import { Project } from '../projects/entities/proejct.entity';
import {
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { OriginalRequirement } from '../projects/entities/originalRequirement.entity';
import { Iteration } from '../projects/entities/iteration.entity';
import { FunctionalRequirement } from '../projects/entities/functionalRequirement.entity';
import { SystemService } from '../projects/entities/systemService.entity';

export type MockRepository<T = any> = Partial<
    Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <T = any>(): MockRepository<T> => ({
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    findByIds: jest.fn(),
});

export function mockUserRepository(userRepository: MockRepository) {
    const testPassword = '(*E$WU(*3298nfjio(WE(*F7s&*WE%FE^';
    const testSalt = makeSalt();

    userRepository.find.mockImplementation(() => {
        return [
            {
                id: 1,
                username: 'LiHua',
                password: encryptPassword(testPassword, testSalt),
                salt: testSalt,
            },
        ];
    });
    userRepository.findOne.mockImplementation(
        (userFindOneDto: UserFindOneDto) => {
            if (
                userFindOneDto.username === 'LiHua' ||
                userFindOneDto.id === 1
            ) {
                return {
                    id: 1,
                    username: 'LiHua',
                    password: encryptPassword(testPassword, testSalt),
                    salt: testSalt,
                    email: 'liHua@gmail.com',
                    nickname: '',
                    isDeleted: false,
                    description: '',
                    createDate: new Date(0),
                    updateDate: new Date(0),
                    deleteDate: new Date(0),
                    ownProjects: Array<Project>(),
                    devProjects: [mockProject],
                    sysProjects: Array<Project>(),
                    qaProjects: Array<Project>(),
                };
            } else if (
                userFindOneDto.username === 'ZhangSan' ||
                userFindOneDto.id === 2
            ) {
                return mockUser2;
            } else if (
                userFindOneDto.username === 'LiHua3' ||
                userFindOneDto.id === 3
            ) {
                return mockUser3;
            } else if (
                userFindOneDto.username === '104' ||
                userFindOneDto.id === 104
            ) {
                return {
                    id: 104,
                    username: '104',
                    password: encryptPassword(testPassword, testSalt),
                    salt: testSalt,
                    email: 'liHua@gmail.com',
                    nickname: '',
                    isDeleted: false,
                    description: '',
                    createDate: new Date(0),
                    updateDate: new Date(0),
                    deleteDate: new Date(0),
                    ownProjects: Array<Project>(),
                    devProjects: Array<Project>(),
                    sysProjects: Array<Project>(),
                    qaProjects: Array<Project>(),
                };
            } else {
                return undefined;
            }
        },
    );
    userRepository.findOneOrFail.mockImplementation(
        (userFindOneDto: UserFindOneDto) => {
            if (userFindOneDto.username === 'LiHua') {
                return {
                    id: 1,
                    username: 'LiHua',
                    password: encryptPassword(testPassword, testSalt),
                    salt: testSalt,
                };
            } else {
                throw new InternalServerErrorException();
            }
        },
    );
    userRepository.create.mockImplementation(
        ({
            username: username,
            password: password,
            salt: salt,
        }: {
            username: string;
            password: string;
            salt: string;
        }) => {
            return {
                id: 1,
                username: username,
                password: password,
                salt: salt,
            };
        },
    );
    userRepository.save.mockImplementation((user: User) => {
        return user;
    });
}

export function mockProjectRepository(projectRepository: MockRepository) {
    projectRepository.find.mockImplementation(() => {
        return [mockProject];
    });
    projectRepository.findOne.mockImplementation(
        ({ id: projectId }: { id: number }) => {
            if (projectId === 1) {
                return mockProject;
            } else {
                return undefined;
            }
        },
    );
    projectRepository.findOneOrFail.mockImplementation(
        ({ id: projectId }: { id: number }) => {
            if (projectId === 1 || projectId === 2) {
                return mockProject;
            } else {
                throw new BadRequestException();
            }
        },
    );
    projectRepository.create.mockImplementation(
        ({
            name: projectName,
            description: description,
            manager: manager,
            systemEngineers: systemEngineers,
            developmentEngineers: developmentEngineers,
            qualityAssuranceEngineers: qualityAssuranceEngineers,
        }: {
            name: string;
            description: string;
            manager: User;
            systemEngineers: User[];
            developmentEngineers: User[];
            qualityAssuranceEngineers: User[];
        }) => {
            return {
                id: 1,
                name: projectName,
                description: description,
                manager: manager,
                systemEngineers: systemEngineers,
                developmentEngineers: developmentEngineers,
                qualityAssuranceEngineers: qualityAssuranceEngineers,
            };
        },
    );
    projectRepository.save.mockImplementation((project: Project) => {
        return project;
    });
}

export function mockOriginalRequirementRepository(
    oriRepository: MockRepository,
) {
    oriRepository.find.mockImplementation(() => {
        return [mockOriginalRequirement];
    });
    oriRepository.findByIds.mockImplementation((ids: number[]) => {
        if (ids.includes(1)) {
            return [mockOriginalRequirement, mockOriginalRequirement2];
        } else {
            return [];
        }
    });
    oriRepository.findOne.mockImplementation(
        ({ id: oriId }: { id: number }) => {
            if (oriId === 1) {
                return mockOriginalRequirement;
            } else if (oriId === 2) {
                return mockOriginalRequirement2;
            } else {
                return undefined;
            }
        },
    );
    oriRepository.findOneOrFail.mockImplementation(
        ({ id: oriId }: { id: number }) => {
            if (oriId === 1) {
                return mockOriginalRequirement;
            } else if (oriId === 2) {
                return mockOriginalRequirement2;
            } else {
                return undefined;
            }
        },
    );
    oriRepository.save.mockImplementation((ori: OriginalRequirement) => {
        return ori;
    });
    oriRepository.delete.mockImplementation(({ id: id }: { id: number }) => {
        return id;
    });
}

export function mockFunctionalRequirementRepository(
    funcRepository: MockRepository,
) {
    funcRepository.find.mockImplementation(() => {
        return [mockFunctionalRequirement];
    });
    funcRepository.findByIds.mockImplementation((ids: number[]) => {
        if (ids.includes(1)) {
            return [mockFunctionalRequirement];
        } else {
            return [];
        }
    });
    funcRepository.findOne.mockImplementation(
        ({ id: funcId }: { id: number }) => {
            if (funcId === 1) {
                return mockFunctionalRequirement;
            } else if (funcId === 2) {
                return mockFunctionalRequirement2;
            } else {
                return undefined;
            }
        },
    );
    funcRepository.findOneOrFail.mockImplementation(
        ({ id: funcId }: { id: number }) => {
            if (funcId === 1) {
                return mockFunctionalRequirement;
            } else if (funcId === 2) {
                return mockFunctionalRequirement2;
            } else {
                throw new Error();
            }
        },
    );
    funcRepository.save.mockImplementation((func: FunctionalRequirement) => {
        return func;
    });
}

export function mockSystemServiceRepository(servRepository: MockRepository) {
    servRepository.find.mockImplementation(() => {
        return [mockSystemService];
    });
    servRepository.findOne.mockImplementation(
        ({ id: servId }: { id: number }) => {
            if (servId === 1) {
                return mockSystemService;
            } else if (servId === 2) {
                return mockSystemService2;
            } else {
                return undefined;
            }
        },
    );
    servRepository.findOneOrFail.mockImplementation(
        ({ id: servId }: { id: number }) => {
            if (servId === 1) {
                return mockSystemService;
            } else if (servId === 2) {
                return mockSystemService2;
            } else {
                return undefined;
            }
        },
    );
    servRepository.save.mockImplementation((serv: SystemService) => {
        return serv;
    });
}

export function mockIterationRepository(iterRepository: MockRepository) {
    iterRepository.find.mockImplementation(() => {
        return [mockIteration];
    });
    iterRepository.findByIds.mockImplementation((ids: number[]) => {
        if (ids.includes(1)) {
            return [mockIteration];
        } else {
            return [];
        }
    });
    iterRepository.findOne.mockImplementation(
        ({ id: iterId }: { id: number }) => {
            if (iterId === 1 || iterId === 2) {
                return mockIteration;
            } else {
                return undefined;
            }
        },
    );
    iterRepository.findOneOrFail.mockImplementation(
        ({ id: iterId }: { id: number }) => {
            if (iterId === 1 || iterId === 2) {
                return mockIteration;
            } else {
                return undefined;
            }
        },
    );
    iterRepository.save.mockImplementation((iter: OriginalRequirement) => {
        return iter;
    });
}

export const mockUser: User = {
    id: 1,
    username: 'LiHua',
    password: undefined,
    salt: makeSalt(),
    email: 'liHua@gmail.com',
    nickname: '',
    isDeleted: false,
    description: '',
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    ownProjects: Array<Project>(),
    devProjects: Array<Project>(),
    sysProjects: Array<Project>(),
    qaProjects: Array<Project>(),
};

export const mockUser2: User = {
    id: 2,
    username: 'ZhangSan',
    password: undefined,
    salt: makeSalt(),
    email: 'zhangsan@gmail',
    nickname: '',
    isDeleted: false,
    description: '',
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    ownProjects: Array<Project>(),
    devProjects: Array<Project>(),
    sysProjects: Array<Project>(),
    qaProjects: Array<Project>(),
};

export const mockProject2: Project = {
    id: 1,
    name: 'Hello',
    description: 'Hello World',
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 0,
    isDeleted: false,
    state: 0,
    iterations: [],
    manager: mockUser,
    systemEngineers: [mockUser],
    developmentEngineers: [mockUser],
    qualityAssuranceEngineers: [mockUser],
    originalRequirements: [],
    systemServices: [],
    hasGitRepo: false,
    gitlabUrl: '',
    gitlabProjId: 0,
    gitAccessToken: '',
    mergeRequestLastAccess: new Date(0),
    issueLastAccess: new Date(0),
    gitIssueTag: '',
};

export const mockIteration: Iteration = {
    id: 1,
    name: 'iter 1',
    description: 'iter',
    deadline: new Date(Date.now()),
    state: 1,
    project: mockProject2,
    directorUsername: 'LiHua',
    functionalRequirements: [
        {
            id: 1,
            name: 'SR.001.001',
            description: 'SR',
            state: 1,
            projectId: 1,
            originalRequirement: undefined,
            distributorId: 1,
            developerId: 2,
            deliveryIteration: undefined,
            systemService: undefined,
            isDeleted: false,
            createDate: new Date(0),
            updateDate: new Date(0),
            deleteDate: new Date(0),
            version: 1,
            relatedMergeRequest: [],
        },
    ],
    isDeleted: false,
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 1,
};

export const mockFunctionalRequirement: FunctionalRequirement = {
    id: 1,
    name: 'SR.001.001',
    description: 'SR',
    state: 1,
    projectId: 1,
    originalRequirement: {
        id: 1,
        name: 'IR.001',
        description: 'IR',
        project: mockProject2,
        state: 1,
        creatorUsername: 'LiHua',
        functionalRequirements: [],
        isDeleted: false,
        createDate: new Date(0),
        updateDate: new Date(0),
        deleteDate: new Date(0),
        version: 1,
    },
    distributorId: 1,
    developerId: 2,
    deliveryIteration: mockIteration,
    systemService: {
        id: 1,
        name: 'System Service #1',
        description: '001',
        project: mockProject2,
        functionalRequirements: [],
        createDate: new Date(0),
        updateDate: new Date(0),
        deleteDate: new Date(0),
        version: 0,
        isDeleted: false,
    },
    isDeleted: false,
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 1,
    relatedMergeRequest: [
        {
            sid: 1,
            projectId: 1,
            mergeRequestId: 1,
            title: 'test1',
            description: 'test1-desc',
            relatedFunctionalRequirement: [],
            relatedIssue: [],
        },
    ],
};

export const mockFunctionalRequirement2: FunctionalRequirement = {
    id: 2,
    name: 'SR.002.002',
    description: 'SR',
    state: 1,
    projectId: 1,
    originalRequirement: {
        id: 1,
        name: 'IR.001',
        description: 'IR',
        project: mockProject2,
        state: 1,
        creatorUsername: 'LiHua',
        functionalRequirements: [],
        isDeleted: false,
        createDate: new Date(0),
        updateDate: new Date(0),
        deleteDate: new Date(0),
        version: 1,
    },
    distributorId: 1,
    developerId: 2,
    deliveryIteration: undefined,
    systemService: undefined,
    isDeleted: false,
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 1,
    relatedMergeRequest: [],
};

export const mockOriginalRequirement: OriginalRequirement = {
    id: 1,
    name: 'IR.001',
    description: 'IR',
    project: mockProject2,
    state: 1,
    creatorUsername: 'LiHua',
    functionalRequirements: [
        mockFunctionalRequirement,
        mockFunctionalRequirement2,
    ],
    isDeleted: false,
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 1,
};

export const mockOriginalRequirement2: OriginalRequirement = {
    id: 2,
    name: 'IR.002',
    description: 'IR',
    project: mockProject2,
    state: 1,
    creatorUsername: 'LiHua',
    functionalRequirements: [mockFunctionalRequirement],
    isDeleted: false,
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 1,
};

export const mockSystemService2: SystemService = {
    id: 2,
    name: 'System Service #2',
    description: '002',
    project: mockProject2,
    functionalRequirements: [mockFunctionalRequirement],
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 0,
    isDeleted: false,
};

export const mockSystemService: SystemService = {
    id: 1,
    name: 'System Service #1',
    description: '001',
    project: mockProject2,
    functionalRequirements: [mockFunctionalRequirement],
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 0,
    isDeleted: false,
};

export const mockProject: Project = {
    id: 1,
    name: 'Hello',
    description: 'Hello World',
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    version: 0,
    isDeleted: false,
    state: 0,
    iterations: [mockIteration],
    manager: mockUser,
    systemEngineers: [mockUser],
    developmentEngineers: [
        mockUser,
        {
            id: 3,
            username: 'LiHua3',
            password: undefined,
            salt: makeSalt(),
            email: 'liHua@gmail.com',
            nickname: '',
            isDeleted: false,
            description: '',
            createDate: new Date(0),
            updateDate: new Date(0),
            deleteDate: new Date(0),
            ownProjects: Array<Project>(),
            devProjects: Array<Project>(),
            sysProjects: Array<Project>(),
            qaProjects: Array<Project>(),
        },
    ],
    qualityAssuranceEngineers: [mockUser],
    originalRequirements: [mockOriginalRequirement, mockOriginalRequirement2],
    systemServices: [mockSystemService, mockSystemService2],
    hasGitRepo: false,
    gitlabUrl: '',
    gitlabProjId: 0,
    gitAccessToken: '',
    mergeRequestLastAccess: new Date(0),
    issueLastAccess: new Date(0),
    gitIssueTag: '',
};

export const mockUser3: User = {
    id: 3,
    username: 'LiHua3',
    password: undefined,
    salt: makeSalt(),
    email: 'liHua@gmail.com',
    nickname: '',
    isDeleted: false,
    description: '',
    createDate: new Date(0),
    updateDate: new Date(0),
    deleteDate: new Date(0),
    ownProjects: Array<Project>(),
    devProjects: [mockProject],
    sysProjects: Array<Project>(),
    qaProjects: Array<Project>(),
};

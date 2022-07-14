import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { ValidityCheck } from '../utils/validity-check';
import { Connection, Repository } from 'typeorm';
import { IterationCreateDto } from './dto/iteration-create.dto';
import { Iteration } from './entities/iteration.entity';
import { Project } from './entities/proejct.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequirementsService } from './requirements.service';

@Injectable()
export class IterationsService {
    constructor(
        @InjectRepository(Iteration)
        private readonly iterationRepository: Repository<Iteration>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly requirementsService: RequirementsService,
        private readonly connection: Connection,
    ) {}

    private checkDeadline(deadline: number) {
        if (deadline <= Date.now()) {
            throw new BadRequestException('003# Earlier DDL');
        }
    }

    private async checkDirectorUsername(username: string, projectId: number) {
        const user = await this.userRepository.findOne(
            { username: username },
            {
                relations: ['devProjects'],
            },
        );
        if (
            !user ||
            !user.devProjects.map((project) => project.id).includes(projectId)
        ) {
            throw new BadRequestException(
                `004# User ${username} is not a development engineer`,
            );
        }
    }

    async findOneIteration(projectId: number, iterId: number) {
        const iter = await this.iterationRepository.findOne(
            {
                id: iterId,
            },
            {
                relations: ['project', 'functionalRequirements'],
            },
        );
        if (!iter) {
            throw new NotFoundException(
                `001# Iteration ${iterId} does not exist`,
            );
        }
        if (iter.project.id !== projectId) {
            throw new UnauthorizedException();
        }
        return {
            id: iter.id,
            name: iter.name,
            description: iter.description,
            deadline: iter.deadline.getTime(),
            state: iter.state,
            directorUsername: iter.directorUsername,
            functionalRequirementIds: iter.functionalRequirements.map(
                (sr) => sr.id,
            ),
            functionalRequirements: iter.functionalRequirements.map((sr) => {
                return {
                    id: sr.id,
                    name: sr.name,
                    description: sr.description,
                    state: sr.state,
                };
            }),
            createDate: iter.createDate.getTime(),
            updateTime: iter.updateDate.getTime(),
        };
    }

    async findAllIterations(projectId: number) {
        const project = await this.projectRepository.findOne(
            {
                id: projectId,
            },
            {
                relations: ['iterations'],
            },
        );
        if (!project) {
            throw new NotFoundException(
                `001# Project ${projectId} does not exist`,
            );
        }
        return (
            await Promise.all(
                project.iterations.map(async (iter) => {
                    return await this.findOneIteration(projectId, iter.id);
                }),
            )
        ).sort((a, b) => a.id - b.id);
    }

    async findIterationsByIds(projectId: number, ids: number[]) {
        const iters = await this.iterationRepository.findByIds(ids, {
            relations: ['project', 'functionalRequirements'],
        });
        return iters
            .filter((iter) => iter.project.id === projectId)
            .map((iter) => {
                return {
                    id: iter.id,
                    name: iter.name,
                    description: iter.description,
                    deadline: iter.deadline.getTime(),
                    state: iter.state,
                    directorUsername: iter.directorUsername,
                    functionalRequirementIds: iter.functionalRequirements.map(
                        (func) => func.id,
                    ),
                    createDate: iter.createDate.getTime(),
                    updateTime: iter.updateDate.getTime(),
                };
            })
            .sort((a, b) => a.id - b.id);
    }

    async createIteration(projectId: number, iterDto: IterationCreateDto) {
        const project = await this.projectRepository.findOneOrFail(
            {
                id: projectId,
            },
            {
                relations: ['iterations'],
            },
        );
        if (!iterDto.id) {
            // create
            if (!ValidityCheck.checkGeneralName(iterDto.name)) {
                throw new BadRequestException(
                    "002# Iteration's name check failed",
                );
            }
            if (
                project.iterations.find(
                    (theIter) => theIter.name === iterDto.name,
                ) !== undefined
            ) {
                throw new BadRequestException(
                    `006# Name ${iterDto.name} duplicates`,
                );
            }
            this.checkDeadline(iterDto.deadline);
            await this.checkDirectorUsername(
                iterDto.directorUsername,
                projectId,
            );
            const iterToSave = new Iteration();
            iterToSave.name = iterDto.name;
            iterToSave.description = iterDto.description;
            iterToSave.deadline = new Date(iterDto.deadline);
            iterToSave.state = 1;
            iterToSave.directorUsername = iterDto.directorUsername;
            iterToSave.functionalRequirements = [];
            project.iterations.push(iterToSave);
            try {
                await this.projectRepository.save(project);
            } catch (err) {
                throw new InternalServerErrorException(err);
            }
            return iterToSave.id;
        } else {
            // update
            const iterToSave = await this.iterationRepository.findOne(
                { id: iterDto.id },
                { relations: ['project'] },
            );
            if (!iterToSave) {
                throw new NotFoundException(
                    `005# Iteration ${iterDto.id} does not exist`,
                );
            }
            if (iterToSave.project.id !== projectId) {
                throw new UnauthorizedException(
                    `001# It is unauthorized to change iteration ${iterDto.id}`,
                );
            }
            // enter this block only when a new name is given
            if (
                iterDto.name !== undefined &&
                iterDto.name !== null &&
                iterDto.name !== iterToSave.name
            ) {
                if (!ValidityCheck.checkGeneralName(iterDto.name)) {
                    throw new BadRequestException(
                        "002# Iteration's name check failed",
                    );
                }
                if (
                    project.iterations.find(
                        (theIter) => theIter.name === iterDto.name,
                    ) !== undefined
                ) {
                    throw new BadRequestException(
                        `006# Name ${iterDto.name} duplicates`,
                    );
                }
                iterToSave.name = iterDto.name;
            }
            if (
                iterDto.description !== undefined &&
                iterDto.description !== null
            ) {
                iterToSave.description = iterDto.description;
            }
            if (
                iterDto.directorUsername !== undefined &&
                iterDto.directorUsername !== null
            ) {
                await this.checkDirectorUsername(
                    iterDto.directorUsername,
                    projectId,
                );
                iterToSave.directorUsername = iterDto.directorUsername;
            }
            if (iterDto.deadline !== undefined && iterDto.deadline !== null) {
                this.checkDeadline(iterDto.deadline);
                iterToSave.deadline = new Date(iterDto.deadline);
            }
            if (iterDto.state !== undefined && iterDto.state !== null) {
                iterToSave.state = iterDto.state;
            }
            try {
                await this.iterationRepository.save(iterToSave);
            } catch (err) {
                throw new InternalServerErrorException(err);
            }
            return iterToSave.id;
        }
    }

    async deleteIteration(projectId: number, iterId: number) {
        const iter = await this.iterationRepository.findOne(
            {
                id: iterId,
            },
            {
                relations: ['project', 'functionalRequirements'],
            },
        );
        if (!iter) {
            throw new NotFoundException(
                `001# Iteration ${iterId} does not exist`,
            );
        }
        if (iter.project.id !== projectId) {
            throw new BadRequestException(
                `002# Project ${projectId} does not have Iteration ${iterId}`,
            );
        }
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            iter.functionalRequirements = [];
            await queryRunner.manager.save(iter);
            await queryRunner.manager.delete(Iteration, {
                id: iterId,
            });
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
        return iterId;
    }

    async findAllFunctionalRequirementsInIteration(
        projectId: number,
        iterId: number,
    ) {
        const iter = await this.findOneIteration(projectId, iterId);
        return await this.requirementsService.findFunctionalRequirementsByIds(
            projectId,
            { ids: iter.functionalRequirementIds },
        );
    }
}

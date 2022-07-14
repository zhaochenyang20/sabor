import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidityCheck } from '../utils/validity-check';
import { Connection, Repository } from 'typeorm';
import { SystemServiceCreateAndUpdateDto } from './dto/system-service-create-and-update.dto';
import { Project } from './entities/proejct.entity';
import { SystemService } from './entities/systemService.entity';
import { RequirementsService } from './requirements.service';

@Injectable()
export class SystemServicesService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(SystemService)
        private readonly systemServiceRepository: Repository<SystemService>,
        private readonly requirementsService: RequirementsService,
        private readonly connection: Connection,
    ) {}

    async findAllSystemServices(projectId: number) {
        const project = await this.projectRepository.findOne(
            {
                id: projectId,
            },
            {
                relations: ['systemServices'],
            },
        );
        if (!project) {
            throw new NotFoundException('001# Project does not exist');
        }
        return (
            await Promise.all(
                project.systemServices.map(async (serv) => {
                    return await this.findOneSystemService(projectId, serv.id);
                }),
            )
        ).sort((a, b) => a.id - b.id);
    }

    async findOneSystemService(projectId: number, servId: number) {
        const serv = await this.systemServiceRepository.findOne(
            {
                id: servId,
            },
            {
                relations: ['project', 'functionalRequirements'],
            },
        );
        if (!serv) {
            throw new NotFoundException(
                `001# System service ${servId} does not exist`,
            );
        }
        if (serv.project.id !== projectId) {
            throw new UnauthorizedException();
        }
        return {
            id: serv.id,
            name: serv.name,
            description: serv.description,
            functionalRequirementIds: serv.functionalRequirements.map(
                (sr) => sr.id,
            ),
            functionalRequirements: serv.functionalRequirements.map((sr) => {
                return {
                    id: sr.id,
                    name: sr.name,
                    description: sr.description,
                    state: sr.state,
                };
            }),
            createDate: serv.createDate.getTime(),
            updateTime: serv.updateDate.getTime(),
        };
    }

    /**
     * updateSystemService: create or update a system service
     * @param projectId id of the project
     * @param servDto system service sent info
     * @returns id
     */
    async updateSystemService(
        projectId: number,
        servDto: SystemServiceCreateAndUpdateDto,
    ) {
        if (!ValidityCheck.checkGeneralName(servDto.name)) {
            throw new BadRequestException(
                "001# system service's name check failed",
            );
        }
        const project = await this.projectRepository.findOne(
            {
                id: projectId,
            },
            {
                relations: ['systemServices'],
            },
        );
        if (!project) {
            throw new NotFoundException('002# Project does not exist');
        }
        const serv = project.systemServices.find(
            (theServ) => theServ.name === servDto.name,
        );
        if (!serv) {
            // create
            if (servDto.description === undefined) {
                throw new BadRequestException('003# Create but no description');
            }
            const servToSave = new SystemService();
            servToSave.name = servDto.name;
            servToSave.description = servDto.description;
            servToSave.functionalRequirements = [];
            project.systemServices.push(servToSave); // cascade
            try {
                await this.projectRepository.save(project);
            } catch (err) {
                throw new InternalServerErrorException(err);
            }
            return servToSave.id;
        } else {
            // update
            const servToSave = await this.systemServiceRepository.findOneOrFail(
                { id: serv.id },
            );
            if (servDto.newName !== undefined && servDto.newName !== null) {
                if (!ValidityCheck.checkGeneralName(servDto.newName)) {
                    throw new BadRequestException('004# New name check failed');
                }
                if (servDto.newName !== servDto.name) {
                    // if the new name is the same as the old, nothing changes
                    const newNameServ = project.systemServices.find(
                        (theServ) => theServ.name === servDto.newName,
                    );
                    if (newNameServ) {
                        throw new BadRequestException(
                            '005# New name duplicates',
                        );
                    }
                    servToSave.name = servDto.newName;
                }
            }
            if (
                servDto.description !== undefined &&
                servDto.description !== null
            ) {
                servToSave.description = servDto.description;
            }
            try {
                await this.systemServiceRepository.save(servToSave);
            } catch (err) {
                throw new InternalServerErrorException(err);
            }
            return servToSave.id;
        }
    }

    /**
     * deleteSystemService: delete a system service
     * @param projectId id of the project
     * @param servId system service id
     * @returns id
     */
    async deleteSystemService(projectId: number, servId: number) {
        const serv = await this.systemServiceRepository.findOne(
            {
                id: servId,
            },
            {
                relations: ['project', 'functionalRequirements'],
            },
        );
        if (!serv) {
            throw new NotFoundException(
                `001# System service ${servId} does not exist`,
            );
        }
        if (serv.project.id !== projectId) {
            throw new BadRequestException(
                `002# Project ${projectId} does not have System service ${servId}`,
            );
        }
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            serv.functionalRequirements = [];
            await queryRunner.manager.save(serv);
            await queryRunner.manager.delete(SystemService, {
                id: servId,
            });
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
        return servId;
    }

    async findAllFunctionalRequirementsInSystemService(
        projectId: number,
        servId: number,
    ) {
        const serv = await this.findOneSystemService(projectId, servId);
        return await this.requirementsService.findFunctionalRequirementsByIds(
            projectId,
            { ids: serv.functionalRequirementIds },
        );
    }
}

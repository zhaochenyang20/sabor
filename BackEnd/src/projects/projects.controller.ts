import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectInviteDto } from './dto/project-invite.dto';
import { ProjectsService } from './projects.service';
import { OriginalRequirementCreateDto } from './dto/original-requirement-create.dto';
import { UserInfoDto } from '../users/dto/user-info.dto';
import { UserInfo } from '../users/user.decorator';
import { OriginalRequirementUpdateDto } from './dto/original-requirement-update.dto';
import { RequirementsService } from './requirements.service';
import { SystemServicesService } from './system-services.service';
import { SystemServiceCreateAndUpdateDto } from './dto/system-service-create-and-update.dto';
import { IterationCreateDto } from './dto/iteration-create.dto';
import { IterationsService } from './iterations.service';
import { FunctionalRequirementCreateDto } from './dto/functional-requirement-create.dto';
import { FunctionalRequirementDeleteDto } from './dto/functional-requirement-delete.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { OriginalRequirementDeleteDto } from './dto/original-requirement-delete.dto';
import { SystemServiceDeleteDto } from './dto/system-service-delete.dto';
import { IterationDeleteDto } from './dto/iteration-delete.dto';
import { FunctionalRequirementChangeStateDto } from './dto/functional-requirement-change-state.dto';
import { FindByIdDto } from './dto/find-by-id.dto';

@Controller('api/projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly requirementsService: RequirementsService,
        private readonly systemServicesService: SystemServicesService,
        private readonly iterationsService: IterationsService,
    ) {}

    // recommend lower-case separated by '-'
    @UseGuards(AuthGuard('jwt'))
    @Get('find-all')
    async findAllProjects(@UserInfo() user: UserInfoDto) {
        return {
            code: 200,
            data: await this.projectsService.findAll(user.id),
        };
    }

    @Get('reset')
    async resetProjectId() {
        return {
            code: 200,
            data: await this.requirementsService.reset(),
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id/find-one')
    async findOneProject(
        @Param('id', new ParseIntPipe()) projectId: number,
        @UserInfo() user: UserInfoDto,
    ) {
        return {
            code: 200,
            data: await this.projectsService.findOne(projectId, user.username),
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createProject(@Body() projectCreateDto: ProjectCreateDto) {
        return {
            code: 200,
            data: await this.projectsService.create(projectCreateDto),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager)
    @Post(':id/update-project')
    async updateProject(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() projectUpdateDto: ProjectUpdateDto,
    ) {
        return {
            code: 200,
            data: await this.projectsService.updateProject(
                projectId,
                projectUpdateDto,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager)
    @Get(':id/delete-project')
    async deleteProject(@Param('id', new ParseIntPipe()) projectId: number) {
        return {
            code: 200,
            data: await this.projectsService.deleteProject(projectId),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager)
    @Post(':id/invite')
    async inviteUser(
        @Body() projectInviteDto: ProjectInviteDto,
        @Param('id', new ParseIntPipe()) projectId: number,
    ) {
        return {
            code: 200,
            data: await this.projectsService.invite(
                projectId,
                projectInviteDto,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-all-ori-require')
    async findAllOriginalRequirements(
        @Param('id', new ParseIntPipe()) projectId: number,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.findAllOriginalRequirements(
                projectId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-one-ori-require/:require')
    async findOneOriginalRequirement(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('require', new ParseIntPipe()) requireId: number,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.findOneOriginalRequirement(
                projectId,
                requireId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/create-ori-require')
    async createOriginalRequirement(
        @Body() oriDto: OriginalRequirementCreateDto,
        @Param('id', new ParseIntPipe()) projectId: number,
        @UserInfo() user: UserInfoDto,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.createOriginalRequirement(
                projectId,
                oriDto,
                user.username,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/update-ori-require')
    async updateOriginalRequirement(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() oriDto: OriginalRequirementUpdateDto,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.updateOriginalRequirement(
                projectId,
                oriDto,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/delete-ori-require')
    async deleteOriginalRequirement(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() oriDto: OriginalRequirementDeleteDto,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.deleteOriginalRequirement(
                projectId,
                oriDto.id,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-all-sys-serv')
    async findAllSystemServices(
        @Param('id', new ParseIntPipe()) projectId: number,
    ) {
        return {
            code: 200,
            data: await this.systemServicesService.findAllSystemServices(
                projectId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-one-sys-serv/:serv')
    async findOneSystemService(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('serv', new ParseIntPipe()) servId: number,
    ) {
        return {
            code: 200,
            data: await this.systemServicesService.findOneSystemService(
                projectId,
                servId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/update-sys-serv')
    async updateSystemService(
        @Body() servDto: SystemServiceCreateAndUpdateDto,
        @Param('id', new ParseIntPipe()) projectId: number,
    ) {
        return {
            code: 200,
            data: await this.systemServicesService.updateSystemService(
                projectId,
                servDto,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/delete-sys-serv')
    async deleteSystemService(
        @Body() servDto: SystemServiceDeleteDto,
        @Param('id', new ParseIntPipe()) projectId: number,
    ) {
        return {
            code: 200,
            return: await this.systemServicesService.deleteSystemService(
                projectId,
                servDto.id,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-all-func-require/serv/:serv')
    async findAllFunctionalRequirementsInSystemService(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('serv', new ParseIntPipe()) servId: number,
    ) {
        return {
            code: 200,
            data: await this.systemServicesService.findAllFunctionalRequirementsInSystemService(
                projectId,
                servId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-one-iter/:iter')
    async findOneIteration(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('iter', new ParseIntPipe()) iterId: number,
    ) {
        return {
            code: 200,
            data: await this.iterationsService.findOneIteration(
                projectId,
                iterId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-all-iter')
    async findAllIterations(
        @Param('id', new ParseIntPipe()) projectId: number,
    ) {
        return {
            code: 200,
            data: await this.iterationsService.findAllIterations(projectId),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Post(':id/find-iter-by-id')
    async findIterationsByIds(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() iterFindDto: FindByIdDto,
    ) {
        return {
            code: 200,
            data: await this.iterationsService.findIterationsByIds(
                projectId,
                iterFindDto.ids,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/create-iter')
    async createIterations(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() iterDto: IterationCreateDto,
    ) {
        return {
            code: 200,
            data: await this.iterationsService.createIteration(
                projectId,
                iterDto,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/delete-iter')
    async deleteIteration(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() iterDto: IterationDeleteDto,
    ) {
        return {
            code: 200,
            data: await this.iterationsService.deleteIteration(
                projectId,
                iterDto.id,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-all-func-require/iter/:iter')
    async findAllFunctionalRequirementsInIteration(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('iter', new ParseIntPipe()) iterId: number,
    ) {
        return {
            code: 200,
            data: await this.iterationsService.findAllFunctionalRequirementsInIteration(
                projectId,
                iterId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-all-func-require/:ori')
    async findAllFunctionalRequirements(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('ori', new ParseIntPipe()) oriId: number,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.findAllFunctionalRequirements(
                projectId,
                oriId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Post(':id/find-func-require-by-id')
    async findFunctionalRequirementsByIds(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() funcFindDto: FindByIdDto,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.findFunctionalRequirementsByIds(
                projectId,
                funcFindDto,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(
        Role.Manager,
        Role.SystemEngineer,
        Role.DevelopmentEngineer,
        Role.QualityAssuranceEngineer,
    )
    @Get(':id/find-one-func-require/:func')
    async findOneFunctionalRequirement(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('func', new ParseIntPipe()) funcId: number,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.findOneFunctionalRequirement(
                projectId,
                funcId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/create-func-require')
    async createFunctionalRequirement(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() funcDto: FunctionalRequirementCreateDto,
        @UserInfo() user: UserInfoDto,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.createFunctionalRequirement(
                projectId,
                funcDto,
                user.id,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SystemEngineer)
    @Post(':id/delete-func-require')
    async deleteFunctionalRequirement(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() funcDto: FunctionalRequirementDeleteDto,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.deleteFunctionalRequirement(
                projectId,
                funcDto.id,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.DevelopmentEngineer)
    @Post(':id/change-func-require-state')
    async changeFunctionalRequirementState(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() funcDto: FunctionalRequirementChangeStateDto,
    ) {
        return {
            code: 200,
            data: await this.requirementsService.changeFunctionalRequirementState(
                projectId,
                funcDto,
            ),
        };
    }
}

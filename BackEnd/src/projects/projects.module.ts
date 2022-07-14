import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OriginalRequirement } from './entities/originalRequirement.entity';
import { RolesGuard } from '../roles/roles.guard';
import { User } from '../users/entities/user.entity';
import { Project } from './entities/proejct.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { FunctionalRequirement } from './entities/functionalRequirement.entity';
import { SystemService } from './entities/systemService.entity';
import { Iteration } from './entities/iteration.entity';
import { RequirementsService } from './requirements.service';
import { SystemServicesService } from './system-services.service';
import { IterationsService } from './iterations.service';
import { UsersModule } from '../users/users.module';
import { MergeRequest } from '../git/entities/mergeRequest.entity';
import { Issue } from '../git/entities/issue.entity';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([
            Project,
            User,
            OriginalRequirement,
            FunctionalRequirement,
            SystemService,
            Iteration,
            MergeRequest,
            Issue,
        ]),
    ],
    controllers: [ProjectsController],
    providers: [
        ProjectsService,
        RequirementsService,
        SystemServicesService,
        IterationsService,
        RolesGuard,
    ],
    exports: [RequirementsService],
})
export class ProjectsModule {}

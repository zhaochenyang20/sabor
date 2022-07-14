import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FunctionalRequirement } from '../projects/entities/functionalRequirement.entity';
import { Project } from '../projects/entities/proejct.entity';
import { ProjectsModule } from '../projects/projects.module';
import { Issue } from './entities/issue.entity';
import { MergeRequest } from './entities/mergeRequest.entity';
import { GitController } from './git.controller';
import { GitService } from './git.service';
import { GitlabService } from './gitlab.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Project,
            MergeRequest,
            FunctionalRequirement,
            Issue,
        ]),
        ProjectsModule,
    ],
    controllers: [GitController],
    providers: [GitlabService, GitService],
})
export class GitModule {}

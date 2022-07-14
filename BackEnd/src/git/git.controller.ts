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
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { AttachMergeRequestDto } from './dto/attach-merge-request.dto';
import { SetGitlabInfoDto } from './dto/set-gitlab-info.dto';
import { GitService } from './git.service';
import { GitlabService } from './gitlab.service';

@Controller('api/')
export class GitController {
    constructor(
        private readonly gitlabService: GitlabService,
        private readonly gitService: GitService,
    ) {}

    //@Get('git/test')
    async test() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.gitlabService.fetchAllIssues(
            492,
            '1ezpEtzHsLRswHaKvvCy',
            'https://gitlab.secoder.net/',
        );
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager)
    @Get('projects/:id/git/get-info')
    async getGitInfo(@Param('id', new ParseIntPipe()) projectId: number) {
        return {
            code: 200,
            data: await this.gitService.getGitInfo(projectId),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager)
    @Post('projects/:id/git/set-info')
    async setGitInfo(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() detail: SetGitlabInfoDto,
    ) {
        return {
            code: 200,
            data: await this.gitService.setGitLabInfo(projectId, detail),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Get('projects/:id/git/get-merge-request')
    async gitMergeRequest(@Param('id', new ParseIntPipe()) projectId: number) {
        return {
            code: 200,
            data: await this.gitService.getMergeRequests(projectId),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Get('projects/:id/git/get-issue')
    async gitIssue(@Param('id', new ParseIntPipe()) projectId: number) {
        return {
            code: 200,
            data: await this.gitService.getIssues(projectId),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Post('projects/:id/git/attach-merge-req-with-func-req')
    async attachMergeRequest(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Body() data: AttachMergeRequestDto,
    ) {
        return {
            code: 200,
            data: await this.gitService.attachMergeRequestWithFunctionalRequest(
                projectId,
                data,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Get('projects/:id/git/get-merge-req-of-func-req/:func')
    async getMergeRequestOfFunctionalRequest(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('func', new ParseIntPipe()) functionalRequestId: number,
    ) {
        return {
            code: 200,
            data: await this.gitService.getMergeRequestOfFunctionalRequest(
                projectId,
                functionalRequestId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Get('projects/:id/git/get-issue-closed-by/:issue')
    async getIssueClosedBy(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('issue', new ParseIntPipe()) issueId: number,
    ) {
        return {
            code: 200,
            data: await this.gitService.getIssueCloseBy(projectId, issueId),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Get('projects/:id/git/get-mr-suggest/:mr')
    async getMergeRequestSuggestion(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('mr', new ParseIntPipe()) mergeRequestId: number,
    ) {
        return {
            code: 200,
            data: await this.gitService.makeMergeRequestAndFunctionalRequestAttachmentSuggestions(
                projectId,
                mergeRequestId,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Get('projects/:id/git/get-issue-caused-by-sr/:sr')
    async getIssueCausedBy(
        @Param('id', new ParseIntPipe()) projectId: number,
        @Param('sr', new ParseIntPipe()) functionalRequirement: number,
    ) {
        return {
            code: 200,
            data: await this.gitService.getIssueCausedByFuncReq(
                projectId,
                functionalRequirement,
            ),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Get('projects/:id/git/get-issue-stat')
    async getIssueStat(@Param('id', new ParseIntPipe()) projectId: number) {
        return {
            code: 200,
            data: await this.gitService.getRepoIssueStat(projectId),
        };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Manager, Role.QualityAssuranceEngineer)
    @Get('projects/:id/git/get-merge-request-stat')
    async getMergeRequestStat(
        @Param('id', new ParseIntPipe()) projectId: number,
    ) {
        return {
            code: 200,
            data: await this.gitService.getRepoMergeRequestStat(projectId),
        };
    }
}

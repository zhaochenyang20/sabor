import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../projects/entities/proejct.entity';
import { Repository } from 'typeorm';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

/**
 * RoleGuard: permission check before controller starts
 * when using it, first set `@Roles()` decorator to declare which roles are able to access it
 * To use guard, **BOTH** `AuthGuard('jwt')` and `RolesGuard` should be used, with `@UsesGuard(AuthGuard('jwt'), RolesGuard)`
 * In the exact order stated above.
 * Also, we assume that project id is stored with variable `id` in the URL parameters.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) return true;

        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        const {
            user,
            params: { id },
        } = context.switchToHttp().getRequest();
        /* eslint-enable */

        // User not found, meaning not authorized
        if (!user) {
            throw new UnauthorizedException();
        }

        //Logger.debug(user)
        // there is an error in authguard
        if (!('id' in user)) {
            throw new InternalServerErrorException('Invalid token parse');
        }

        //Logger.debug(id)
        // checking project id parameter
        if (
            (typeof id !== 'number' && typeof id !== 'string') ||
            (typeof id === 'string' && !/\d+/.test(id))
        ) {
            throw new BadRequestException(
                'Invalid type of project id in request!',
            );
        }

        const project = await this.projectRepository.findOne(
            { id: typeof id === 'string' ? parseInt(id, 10) : id },
            {
                relations: [
                    'manager',
                    'systemEngineers',
                    'developmentEngineers',
                    'qualityAssuranceEngineers',
                ],
            },
        );
        if (!project) {
            throw new NotFoundException('Project id not found!');
        }

        let flag = false;
        // check each role, if one of them matches.
        for (const role of requiredRoles) {
            /* eslint-disable @typescript-eslint/no-unsafe-member-access */
            switch (role) {
                case Role.Manager:
                    if (project.manager.id === user.id) {
                        flag = true;
                    }
                    break;
                case Role.SystemEngineer:
                    if (
                        project.systemEngineers.some(
                            (ele) => ele.id === user.id,
                        )
                    ) {
                        flag = true;
                    }
                    break;
                case Role.DevelopmentEngineer:
                    if (
                        project.developmentEngineers.some(
                            (ele) => ele.id === user.id,
                        )
                    ) {
                        flag = true;
                    }
                    break;
                case Role.QualityAssuranceEngineer:
                    if (
                        project.qualityAssuranceEngineers.some(
                            (ele) => ele.id === user.id,
                        )
                    ) {
                        flag = true;
                    }
                    break;
            }
            /* eslint-enable */
        }
        return flag;
    }
}

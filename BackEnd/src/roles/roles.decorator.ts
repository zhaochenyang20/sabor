import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ROLES_KEY = 'roles';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

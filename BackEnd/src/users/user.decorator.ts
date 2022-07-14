import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// We Need to follow nest's naming convention.
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserInfo = createParamDecorator(
    // _ should be accepted
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (_: unknown, ctx: ExecutionContext) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = ctx.switchToHttp().getRequest();
        // These are determined by AuthGuard
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return request.user;
    },
);

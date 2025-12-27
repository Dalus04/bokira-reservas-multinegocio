import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentBusinessRole = 'STAFF' | 'MANAGER' | undefined;

export const CurrentBusinessRole = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): CurrentBusinessRole => {
        const req = ctx.switchToHttp().getRequest();
        return req.businessRole as CurrentBusinessRole;
    },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GlobalRole } from 'src/model/domain/enums/global-role';

export type JwtUserPayload = {
    sub: string; 
    email: string;
    globalRole: GlobalRole;
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): JwtUserPayload => {
        const req = ctx.switchToHttp().getRequest();
        return req.user as JwtUserPayload;
    },
);

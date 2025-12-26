import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { JwtUserPayload } from '../decorators/current-user.decorator';
import type { GlobalRole } from 'src/model/domain/enums/global-role';  

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<GlobalRole[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (!required || required.length === 0) return true;

        const req = ctx.switchToHttp().getRequest();
        const user = req.user as JwtUserPayload | undefined;
        if (!user) return false;

        return required.includes(user.globalRole);
    }
}

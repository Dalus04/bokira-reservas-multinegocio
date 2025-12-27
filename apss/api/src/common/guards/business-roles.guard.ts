import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BUSINESS_ROLES_KEY } from '../decorators/business-roles.decorator';

@Injectable()
export class BusinessRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<string[]>(
            BUSINESS_ROLES_KEY,
            [ctx.getHandler(), ctx.getClass()],
        );
        if (!required || required.length === 0) return true;

        const req = ctx.switchToHttp().getRequest();
        return required.includes(req.businessRole);
    }
}

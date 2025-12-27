import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type TenantContext = {
    businessId: string;
    slug?: string;
    ownerId: string;
};

export const Tenant = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): TenantContext => {
        const req = ctx.switchToHttp().getRequest();
        return req.tenant as TenantContext;
    },
);

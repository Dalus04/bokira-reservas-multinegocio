import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { BUSINESS_REPO, type BusinessRepoPort } from 'src/model/ports/repositories/business.repo.port';

@Injectable()
export class BusinessAccessGuard implements CanActivate {
    constructor(@Inject(BUSINESS_REPO) private readonly businessRepo: BusinessRepoPort) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const userId = req.user?.sub;
        const tenant = req.tenant;

        if (!userId) throw new ForbiddenException();

        if (tenant.ownerId === userId) {
            req.businessRole = 'MANAGER'; 
            return true;
        }

        const membership = await this.businessRepo.findMembership(
            tenant.businessId,
            userId,
        );

        if (!membership || !membership.isActive) {
            throw new ForbiddenException('No access to this business');
        }

        req.businessRole = membership.role;
        return true;
    }
}

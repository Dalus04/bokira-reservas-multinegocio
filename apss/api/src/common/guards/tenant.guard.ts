import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { BUSINESS_REPO, type BusinessRepoPort } from 'src/model/ports/repositories/business.repo.port';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(@Inject(BUSINESS_REPO) private readonly businessRepo: BusinessRepoPort) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();

        const businessId = req.params?.businessId;
        const slug = req.params?.slug;

        const business = businessId
            ? await this.businessRepo.findById(businessId)
            : slug
                ? await this.businessRepo.findBySlug(slug)
                : null;

        if (!business) throw new NotFoundException('Business not found');

        // Public visibility rule
        if (!req.user) {
            if (!business.isActive || business.status !== 'APPROVED') {
                throw new ForbiddenException('Business not available');
            }
        }

        req.tenant = {
            businessId: business.id,
            slug: business.slug,
            ownerId: business.ownerId,
        };

        return true;
    }
}

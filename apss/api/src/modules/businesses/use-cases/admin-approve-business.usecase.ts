import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BUSINESSES_REPO, type BusinessesRepoPort } from 'src/model/ports/repositories/businesses.repo.port';

@Injectable()
export class AdminApproveBusinessUseCase {
    constructor(@Inject(BUSINESSES_REPO) private readonly repo: BusinessesRepoPort) { }

    async exec(businessId: string, adminId: string) {
        const b = await this.repo.getById(businessId);
        if (!b) throw new BadRequestException({ code: 'BUSINESS_NOT_FOUND', message: 'Not found' });
        if (b.status !== 'PENDING_REVIEW') {
            throw new BadRequestException({ code: 'BUSINESS_INVALID_STATUS', message: 'Not in review' });
        }
        return this.repo.adminApprove(businessId, adminId);
    }
}

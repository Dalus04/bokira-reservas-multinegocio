import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LOYALTY_REPO, type LoyaltyRepoPort } from 'src/model/ports/repositories/loyalty.repo.port';

@Injectable()
export class GetMyLoyaltyUseCase {
    constructor(@Inject(LOYALTY_REPO) private readonly repo: LoyaltyRepoPort) { }

    async exec(input: { userId: string; businessId: string; page: number; limit: number }) {
        if (!input.businessId) throw new BadRequestException({ code: 'BUSINESS_ID_REQUIRED', message: 'businessId required' });

        const account = await this.repo.getMyAccount({ userId: input.userId, businessId: input.businessId });
        const events = await this.repo.listMyEvents({
            userId: input.userId,
            businessId: input.businessId,
            page: input.page,
            limit: input.limit,
        });

        return {
            businessId: input.businessId,
            account,
            events,
        };
    }
}

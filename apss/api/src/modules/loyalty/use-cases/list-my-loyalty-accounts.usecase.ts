import { Inject, Injectable } from '@nestjs/common';
import { LOYALTY_REPO, type LoyaltyRepoPort } from 'src/model/ports/repositories/loyalty.repo.port';

@Injectable()
export class ListMyLoyaltyAccountsUseCase {
    constructor(@Inject(LOYALTY_REPO) private readonly repo: LoyaltyRepoPort) { }

    async exec(input: { userId: string }) {
        const items = await this.repo.listMyAccounts(input.userId);
        return { items };
    }
}

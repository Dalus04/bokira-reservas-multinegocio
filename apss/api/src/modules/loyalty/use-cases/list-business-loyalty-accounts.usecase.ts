import { Inject, Injectable } from '@nestjs/common';
import { LOYALTY_REPO, type LoyaltyRepoPort } from 'src/model/ports/repositories/loyalty.repo.port';

@Injectable()
export class ListBusinessLoyaltyAccountsUseCase {
    constructor(@Inject(LOYALTY_REPO) private readonly repo: LoyaltyRepoPort) { }

    async exec(input: { businessId: string; page: number; limit: number; q?: string }) {
        return this.repo.listBusinessAccounts(input);
    }
}

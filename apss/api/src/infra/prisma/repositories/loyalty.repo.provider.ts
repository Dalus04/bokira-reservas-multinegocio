import { LOYALTY_REPO } from 'src/model/ports/repositories/loyalty.repo.port';
import { LoyaltyPrismaRepo } from '../loyalty.prisma.repo';

export const loyaltyRepoProvider = {
    provide: LOYALTY_REPO,
    useClass: LoyaltyPrismaRepo,
};

import { BUSINESS_REPO } from 'src/model/ports/repositories/business.repo.port';
import { BusinessesPrismaRepo } from './businesses.prisma.repo';

export const businessesRepoProvider = {
    provide: BUSINESS_REPO,
    useClass: BusinessesPrismaRepo,
};

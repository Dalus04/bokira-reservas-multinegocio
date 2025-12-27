import { BUSINESSES_REPO } from 'src/model/ports/repositories/businesses.repo.port';
import { BusinessesFullPrismaRepo } from './businesses-full.prisma.repo';

export const businessesFullRepoProvider = {
    provide: BUSINESSES_REPO,
    useClass: BusinessesFullPrismaRepo,
};

import { SERVICE_CATEGORIES_REPO } from 'src/model/ports/repositories/service-categories.repo.port';
import { ServiceCategoriesPrismaRepo } from './service-categories.prisma.repo';

export const serviceCategoriesRepoProvider = {
    provide: SERVICE_CATEGORIES_REPO,
    useClass: ServiceCategoriesPrismaRepo,
};

import { PLATFORM_CATEGORIES_REPO } from 'src/model/ports/repositories/platform-categories.repo.port';
import { PlatformCategoriesPrismaRepo } from './platform-categories.prisma.repo';

export const platformCategoriesRepoProvider = {
    provide: PLATFORM_CATEGORIES_REPO,
    useClass: PlatformCategoriesPrismaRepo,
};

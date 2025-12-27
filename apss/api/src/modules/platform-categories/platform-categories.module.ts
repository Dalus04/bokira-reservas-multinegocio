import { Module } from '@nestjs/common';
import { PlatformCategoriesPublicController } from './platform-categories.public.controller';
import { ListPlatformCategoriesUseCase } from './use-cases/list-platform-categories.usecase';
import { GetPlatformCategoryBySlugUseCase } from './use-cases/get-platform-category-by-slug.usecase';

import { PlatformCategoriesPrismaRepo } from 'src/infra/prisma/repositories/platform-categories.prisma.repo';
import { platformCategoriesRepoProvider } from 'src/infra/prisma/repositories/platform-categories.repo.provider';

@Module({
    controllers: [PlatformCategoriesPublicController],
    providers: [
        ListPlatformCategoriesUseCase,
        GetPlatformCategoryBySlugUseCase,

        PlatformCategoriesPrismaRepo,
        platformCategoriesRepoProvider,
    ],
})
export class PlatformCategoriesModule { }

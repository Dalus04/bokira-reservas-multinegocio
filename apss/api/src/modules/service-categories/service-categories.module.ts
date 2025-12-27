import { Module } from '@nestjs/common';

import { ServiceCategoriesController } from './service-categories.controller';
import { ServiceCategoriesPublicController } from './service-categories.public.controller';

import { CreateServiceCategoryUseCase } from './use-cases/create-service-category.usecase';
import { UpdateServiceCategoryUseCase } from './use-cases/update-service-category.usecase';
import { ListServiceCategoriesUseCase } from './use-cases/list-service-categories.usecase';
import { ListPublicServiceCategoriesUseCase } from './use-cases/list-public-service-categories.usecase';

import { ServiceCategoriesPrismaRepo } from 'src/infra/prisma/repositories/service-categories.prisma.repo';
import { serviceCategoriesRepoProvider } from 'src/infra/prisma/repositories/service-categories.repo.provider';

@Module({
    controllers: [ServiceCategoriesController, ServiceCategoriesPublicController],
    providers: [
        CreateServiceCategoryUseCase,
        UpdateServiceCategoryUseCase,
        ListServiceCategoriesUseCase,
        ListPublicServiceCategoriesUseCase,

        ServiceCategoriesPrismaRepo,
        serviceCategoriesRepoProvider,
    ],
})
export class ServiceCategoriesModule { }

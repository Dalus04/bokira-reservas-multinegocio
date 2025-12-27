import { Module } from '@nestjs/common';

import { ServicesController } from './services.controller';
import { ServicesPublicController } from './services.public.controller';

import { CreateServiceUseCase } from './use-cases/create-service.usecase';
import { ListServicesUseCase } from './use-cases/list-services.usecase';
import { GetServiceUseCase } from './use-cases/get-service.usecase';
import { UpdateServiceUseCase } from './use-cases/update-service.usecase';
import { ArchiveServiceUseCase } from './use-cases/archive-service.usecase';

import { ListPublicServicesUseCase } from './use-cases/list-public-services.usecase';
import { GetPublicServiceUseCase } from './use-cases/get-public-service.usecase';

import { ServicesPrismaRepo } from 'src/infra/prisma/repositories/services.prisma.repo';
import { servicesRepoProvider } from 'src/infra/prisma/repositories/services.repo.provider';

@Module({
    controllers: [ServicesController, ServicesPublicController],
    providers: [
        CreateServiceUseCase,
        ListServicesUseCase,
        GetServiceUseCase,
        UpdateServiceUseCase,
        ArchiveServiceUseCase,
        ListPublicServicesUseCase,
        GetPublicServiceUseCase,

        ServicesPrismaRepo,
        servicesRepoProvider,
    ],
})
export class ServicesModule { }

import { Module } from '@nestjs/common';

import { BusinessesPublicController } from './businesses.public.controller';
import { BusinessesController } from './businesses.controller';
import { BusinessesAdminController } from './businesses.admin.controller';

import { BusinessesFullPrismaRepo } from 'src/infra/prisma/repositories/businesses-full.prisma.repo';
import { businessesFullRepoProvider } from 'src/infra/prisma/repositories/businesses-full.repo.provider';

import { PublicListBusinessesUseCase } from './use-cases/public-list-businesses.usecase';
import { PublicGetBusinessBySlugUseCase } from './use-cases/public-get-business-by-slug.usecase';
import { CreateBusinessUseCase } from './use-cases/create-business.usecase';
import { ListMyBusinessesUseCase } from './use-cases/list-my-businesses.usecase';
import { GetBusinessPrivateUseCase } from './use-cases/get-business-private.usecase';
import { UpdateBusinessUseCase } from './use-cases/update-business.usecase';
import { SubmitBusinessForReviewUseCase } from './use-cases/submit-business-for-review.usecase';
import { AdminListBusinessesUseCase } from './use-cases/admin-list-pending-businesses.usecase';
import { AdminApproveBusinessUseCase } from './use-cases/admin-approve-business.usecase';
import { AdminRejectBusinessUseCase } from './use-cases/admin-reject-business.usecase';
import { AdminSuspendBusinessUseCase } from './use-cases/admin-suspend-business.usecase';

import { BusinessesPrismaRepo } from '../../infra/prisma/repositories/businesses.prisma.repo';
import { businessesRepoProvider } from '../../infra/prisma/repositories/businesses.repo.provider';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { BusinessAccessGuard } from '../../common/guards/business-access.guard';

@Module({
    controllers: [BusinessesController, BusinessesPublicController, BusinessesAdminController],
    providers: [
        BusinessesFullPrismaRepo,
        businessesFullRepoProvider,

        BusinessesPrismaRepo,
        businessesRepoProvider,

        TenantGuard,
        BusinessAccessGuard,

        PublicListBusinessesUseCase,
        PublicGetBusinessBySlugUseCase,
        CreateBusinessUseCase,
        ListMyBusinessesUseCase,
        GetBusinessPrivateUseCase,
        UpdateBusinessUseCase,
        SubmitBusinessForReviewUseCase,
        AdminListBusinessesUseCase,
        AdminApproveBusinessUseCase,
        AdminRejectBusinessUseCase,
        AdminSuspendBusinessUseCase,
    ],
})
export class BusinessesModule { }

import { Global, Module } from '@nestjs/common';

import { BusinessesPrismaRepo } from 'src/infra/prisma/repositories/businesses.prisma.repo';
import { businessesRepoProvider } from 'src/infra/prisma/repositories/businesses.repo.provider';

@Global()
@Module({
    providers: [
        BusinessesPrismaRepo,
        businessesRepoProvider, // ✅ provee BUSINESS_REPO
    ],
    exports: [
        businessesRepoProvider, // ✅ exporta el token BUSINESS_REPO
    ],
})
export class CoreModule { }

import { Module } from '@nestjs/common';

import { LoyaltyController } from './loyalty.controller';
import { LoyaltyBusinessController } from './loyalty.business.controller';

import { LoyaltyPrismaRepo } from 'src/infra/prisma/loyalty.prisma.repo';
import { loyaltyRepoProvider } from 'src/infra/prisma/repositories/loyalty.repo.provider';

import { GetMyLoyaltyUseCase } from './use-cases/get-my-loyalty.usecase';
import { ListMyLoyaltyAccountsUseCase } from './use-cases/list-my-loyalty-accounts.usecase';
import { ListBusinessLoyaltyAccountsUseCase } from './use-cases/list-business-loyalty-accounts.usecase';

import { LoyaltyEventsSubscriber } from './suscribers/loyalty-events.subscriber';

@Module({
    controllers: [LoyaltyController, LoyaltyBusinessController],
    providers: [
        LoyaltyPrismaRepo,
        loyaltyRepoProvider,

        GetMyLoyaltyUseCase,
        ListMyLoyaltyAccountsUseCase,
        ListBusinessLoyaltyAccountsUseCase,

        LoyaltyEventsSubscriber,
    ],
})
export class LoyaltyModule { }

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser, type JwtUserPayload } from 'src/common/decorators/current-user.decorator';

import { GetMyLoyaltyDto } from './dtos/get-my-loyalty.dto';
import { GetMyLoyaltyUseCase } from './use-cases/get-my-loyalty.usecase';
import { ListMyLoyaltyAccountsUseCase } from './use-cases/list-my-loyalty-accounts.usecase';

@ApiTags('my/loyalty')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard)
@Controller('my/loyalty')
export class LoyaltyController {
    constructor(
        private readonly getUC: GetMyLoyaltyUseCase,
        private readonly listUC: ListMyLoyaltyAccountsUseCase,
    ) { }

    @Get('accounts')
    @ApiOperation({ summary: 'List my loyalty accounts (customer)' })
    list(@CurrentUser() user: JwtUserPayload) {
        return this.listUC.exec({ userId: user.sub });
    }

    @Get()
    @ApiOperation({ summary: 'Get my loyalty in a business (customer)' })
    get(@CurrentUser() user: JwtUserPayload, @Query() q: GetMyLoyaltyDto) {
        return this.getUC.exec({
            userId: user.sub,
            businessId: q.businessId,
            page: q.page ?? 1,
            limit: q.limit ?? 20,
        });
    }
}

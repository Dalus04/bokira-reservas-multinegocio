import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';
import { BusinessRolesGuard } from 'src/common/guards/business-roles.guard';
import { BusinessRoles } from 'src/common/decorators/business-roles.decorator';

import { BusinessRole } from 'src/model/domain/enums/business-role';

import { ListBusinessLoyaltyAccountsDto } from './dtos/list-business-loyalty-accounts.dto';
import { ListBusinessLoyaltyAccountsUseCase } from './use-cases/list-business-loyalty-accounts.usecase';

@ApiTags('my/business-loyalty')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard, BusinessRolesGuard)
@Controller('my/businesses/:businessId/loyalty')
export class LoyaltyBusinessController {
    constructor(private readonly listUC: ListBusinessLoyaltyAccountsUseCase) { }

    @Get('customers')
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'List business loyalty accounts (MANAGER)' })
    list(@Param('businessId') businessId: string, @Query() q: ListBusinessLoyaltyAccountsDto) {
        return this.listUC.exec({
            businessId,
            q: q.q,
            page: q.page ?? 1,
            limit: q.limit ?? 20,
        });
    }
}

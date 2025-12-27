import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';
import { BusinessRolesGuard } from 'src/common/guards/business-roles.guard';
import { BusinessRoles } from 'src/common/decorators/business-roles.decorator';
import { BusinessRole } from 'src/model/domain/enums/business-role';

import { UpsertBusinessHoursDto } from './dtos/upsert-business-hours.dto';
import { ListBusinessHoursUseCase } from './use-cases/list-business-hours.usecase';
import { UpsertBusinessHoursUseCase } from './use-cases/upsert-business-hours.usecase';

@ApiTags('business-hours')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard)
@Controller('my/businesses/:businessId/business-hours')
export class BusinessHoursController {
    constructor(
        private readonly listUC: ListBusinessHoursUseCase,
        private readonly upsertUC: UpsertBusinessHoursUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get business weekly hours' })
    list(@Param('businessId') businessId: string) {
        return this.listUC.exec(businessId);
    }

    @Put()
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Upsert business weekly hours (0-6)' })
    upsert(@Param('businessId') businessId: string, @Body() dto: UpsertBusinessHoursDto) {
        return this.upsertUC.exec(businessId, dto.weekly);
    }
}

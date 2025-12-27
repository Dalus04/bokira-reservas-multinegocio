import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';
import { BusinessRolesGuard } from 'src/common/guards/business-roles.guard';
import { BusinessRoles } from 'src/common/decorators/business-roles.decorator';
import { BusinessRole } from 'src/model/domain/enums/business-role';

import { UpsertStaffWorkingHoursDto } from './dtos/upsert-staff-working-hours.dto';
import { ListStaffWorkingHoursUseCase } from './use-cases/list-staff-working-hours.usecase';
import { UpsertStaffWorkingHoursUseCase } from './use-cases/upsert-staff-working-hours.usecase';

@ApiTags('staff-working-hours')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard)
@Controller('my/businesses/:businessId/staff-working-hours')
export class StaffWorkingHoursController {
    constructor(
        private readonly listUC: ListStaffWorkingHoursUseCase,
        private readonly upsertUC: UpsertStaffWorkingHoursUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get staff weekly hours (query by staffId)' })
    @ApiQuery({ name: 'staffId', required: true, example: 'cuid_staff_user_id' })
    list(@Param('businessId') businessId: string, @Query('staffId') staffId: string) {
        return this.listUC.exec(businessId, staffId);
    }

    @Put(':staffId')
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Upsert staff weekly hours (0-6)' })
    @ApiParam({ name: 'staffId', example: 'cuid_staff_user_id' })
    upsert(
        @Param('businessId') businessId: string,
        @Param('staffId') staffId: string,
        @Body() dto: UpsertStaffWorkingHoursDto,
    ) {
        return this.upsertUC.exec(businessId, staffId, dto.weekly);
    }
}

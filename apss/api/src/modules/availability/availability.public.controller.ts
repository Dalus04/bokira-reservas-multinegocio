import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { TenantGuard } from 'src/common/guards/tenant.guard';
import { Tenant, type TenantContext } from 'src/common/decorators/tenant.decorator';

import { AvailabilityPublicQueryDto } from './dtos/availability-query.dto';
import { GetAvailabilitySlotsUseCase } from './use-cases/get-availability-slots.usecase';

@ApiTags('availability')
@UseGuards(TenantGuard)
@Controller('businesses/:slug/availability')
export class AvailabilityPublicController {
    constructor(private readonly uc: GetAvailabilitySlotsUseCase) { }

    @Get()
    @ApiOperation({ summary: 'Public availability slots by business slug' })
    @ApiParam({
        name: 'slug',
        description: 'Business slug (SEO-friendly identifier)',
        example: 'barberia-black-beard',
    })
    get(
        @Tenant() tenant: TenantContext,
        @Query() q: AvailabilityPublicQueryDto,
    ) {
        return this.uc.exec({
            businessId: tenant.businessId,
            serviceId: q.serviceId,
            date: q.date,
            staffId: q.staffId,
        });
    }
}

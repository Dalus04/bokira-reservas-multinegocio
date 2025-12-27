import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';

import { AvailabilityPrivateQueryDto } from './dtos/availability-query.dto';
import { GetAvailabilitySlotsUseCase } from './use-cases/get-availability-slots.usecase';

@ApiTags('availability')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard)
@Controller('my/businesses/:businessId/availability')
export class AvailabilityController {
    constructor(private readonly uc: GetAvailabilitySlotsUseCase) { }

    @Get()
    @ApiOperation({ summary: 'Private availability slots by businessId (range reduced to days)' })
    async get(@Param('businessId') businessId: string, @Query() q: AvailabilityPrivateQueryDto) {
        // MVP: devolvemos slots SOLO por día (si quieres multi-día, iteramos por fechas)
        const date = q.from.slice(0, 10); // YYYY-MM-DD
        return this.uc.exec({
            businessId,
            serviceId: q.serviceId,
            date,
            staffId: q.staffId,
        });
    }
}

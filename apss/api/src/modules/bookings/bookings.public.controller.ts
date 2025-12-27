import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';

import { Tenant, type TenantContext } from 'src/common/decorators/tenant.decorator';
import { CurrentUser, type JwtUserPayload } from 'src/common/decorators/current-user.decorator';

import { CreateBookingPublicDto } from './dtos/create-booking.public.dto';
import { CreateBookingPublicUseCase } from './use-cases/create-booking.public.usecase';

@ApiTags('bookings')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard)
@Controller('businesses/:slug/bookings')
export class BookingsPublicController {
    constructor(private readonly uc: CreateBookingPublicUseCase) { }

    @Post()
    @ApiOperation({ summary: 'Create booking (public route by slug, requires login)' })
    @ApiParam({ name: 'slug', example: 'barberia-black-beard' })
    create(
        @Tenant() tenant: TenantContext,
        @CurrentUser() user: JwtUserPayload,
        @Body() dto: CreateBookingPublicDto,
    ) {
        return this.uc.exec({
            customerId: user.sub,
            businessId: tenant.businessId,
            serviceId: dto.serviceId,
            startAt: new Date(dto.startAt),
            staffId: dto.staffId,
            notes: dto.notes ?? null,
        });
    }
}

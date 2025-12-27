import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';

import { CurrentUser, type JwtUserPayload } from 'src/common/decorators/current-user.decorator';
import { CurrentBusinessRole, type CurrentBusinessRole as CBR } from 'src/common/decorators/current-business-role.decorator';

import { ListBookingsDto } from './dtos/list-bookings.dto';
import { ConfirmBookingDto } from './dtos/confirm-booking.dto';
import { CancelBookingDto } from './dtos/cancel-booking.dto';
import { RescheduleBookingDto } from './dtos/reschedule-booking.dto';

import { ListBookingsUseCase } from './use-cases/list-bookings.usecase';
import { GetBookingUseCase } from './use-cases/get-booking.usecase';
import { ConfirmBookingUseCase } from './use-cases/confirm-booking.usecase';
import { CancelBookingUseCase } from './use-cases/cancel-booking.usecase';
import { RescheduleBookingUseCase } from './use-cases/reschedule-booking.usecase';

@ApiTags('bookings')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard)
@Controller('my/businesses/:businessId/bookings')
export class BookingsController {
    constructor(
        private readonly listUC: ListBookingsUseCase,
        private readonly getUC: GetBookingUseCase,
        private readonly confirmUC: ConfirmBookingUseCase,
        private readonly cancelUC: CancelBookingUseCase,
        private readonly rescheduleUC: RescheduleBookingUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List business bookings (STAFF sees only own)' })
    list(
        @Param('businessId') businessId: string,
        @Query() q: ListBookingsDto,
        @CurrentUser() user: JwtUserPayload,
        @CurrentBusinessRole() role: CBR,
    ) {
        return this.listUC.exec({
            businessId,
            from: q.from ? new Date(q.from) : undefined,
            to: q.to ? new Date(q.to) : undefined,
            status: q.status,
            staffId: q.staffId,
            page: q.page,
            limit: q.limit,
            actorRole: role,
            actorUserId: user.sub,
        });
    }

    @Get(':bookingId')
    @ApiOperation({ summary: 'Get booking detail' })
    @ApiParam({ name: 'bookingId' })
    get(
        @Param('businessId') businessId: string,
        @Param('bookingId') bookingId: string,
        @CurrentUser() user: JwtUserPayload,
        @CurrentBusinessRole() role: CBR,
    ) {
        return this.getUC.exec({ businessId, bookingId, actorRole: role, actorUserId: user.sub });
    }

    @Post(':bookingId/confirm')
    @ApiOperation({ summary: 'Confirm booking' })
    confirm(
        @Param('businessId') businessId: string,
        @Param('bookingId') bookingId: string,
        @Body() dto: ConfirmBookingDto,
        @CurrentUser() user: JwtUserPayload,
        @CurrentBusinessRole() role: CBR,
    ) {
        return this.confirmUC.exec({
            businessId,
            bookingId,
            note: dto.note ?? null,
            actorRole: role,
            actorUserId: user.sub,
        });
    }

    @Post(':bookingId/cancel')
    @ApiOperation({ summary: 'Cancel booking' })
    cancel(
        @Param('businessId') businessId: string,
        @Param('bookingId') bookingId: string,
        @Body() dto: CancelBookingDto,
        @CurrentUser() user: JwtUserPayload,
        @CurrentBusinessRole() role: CBR,
    ) {
        return this.cancelUC.exec({
            businessId,
            bookingId,
            reason: dto.reason ?? null,
            actorRole: role,
            actorUserId: user.sub,
        });
    }

    @Post(':bookingId/reschedule')
    @ApiOperation({ summary: 'Reschedule booking (sets status back to PENDING)' })
    reschedule(
        @Param('businessId') businessId: string,
        @Param('bookingId') bookingId: string,
        @Body() dto: RescheduleBookingDto,
        @CurrentUser() user: JwtUserPayload,
        @CurrentBusinessRole() role: CBR,
    ) {
        return this.rescheduleUC.exec({
            businessId,
            bookingId,
            startAt: new Date(dto.startAt),
            staffId: dto.staffId,
            reason: dto.reason ?? null,
            actorRole: role,
            actorUserId: user.sub,
        });
    }
}

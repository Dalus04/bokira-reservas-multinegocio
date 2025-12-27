import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BOOKINGS_REPO, type BookingsRepoPort } from 'src/model/ports/repositories/bookings.repo.port';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';
import { GetAvailabilitySlotsUseCase } from 'src/modules/availability/use-cases/get-availability-slots.usecase';

@Injectable()
export class RescheduleBookingUseCase {
    constructor(
        @Inject(BOOKINGS_REPO) private readonly bookingsRepo: BookingsRepoPort,
        @Inject(SERVICES_REPO) private readonly servicesRepo: ServicesRepoPort,
        private readonly availabilityUC: GetAvailabilitySlotsUseCase,
    ) { }

    async exec(input: {
        businessId: string;
        bookingId: string;
        startAt: Date;
        staffId?: string;
        reason?: string | null;
        actorRole?: 'STAFF' | 'MANAGER';
        actorUserId: string;
    }) {
        const booking = await this.bookingsRepo.findById(input.businessId, input.bookingId);
        if (!booking) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Not found' });

        if (input.actorRole === 'STAFF' && booking.staffId !== input.actorUserId) {
            throw new ForbiddenException({ code: 'FORBIDDEN', message: 'No access' });
        }

        const service = await this.servicesRepo.findForAvailability(booking.serviceId);
        if (!service) throw new NotFoundException({ code: 'SERVICE_NOT_FOUND', message: 'Not found' });

        const endAt = new Date(input.startAt.getTime() + service.durationMin * 60_000);
        const date = input.startAt.toISOString().slice(0, 10);

        const avail = await this.availabilityUC.exec({
            businessId: input.businessId,
            serviceId: booking.serviceId,
            date,
            staffId: input.staffId ?? booking.staffId ?? undefined,
        });

        const ok = avail.slots.some((s) => s.startAt === input.startAt.toISOString() && s.endAt === endAt.toISOString());
        if (!ok) throw new BadRequestException({ code: 'SLOT_NOT_AVAILABLE', message: 'Selected slot is not available' });

        const overlap = await this.bookingsRepo.hasOverlap({
            businessId: input.businessId,
            startAt: input.startAt,
            endAt,
            staffId: (input.staffId ?? booking.staffId) ?? null,
            excludeBookingId: booking.id,
        });
        if (overlap) throw new BadRequestException({ code: 'BOOKING_OVERLAP', message: 'Time overlaps with an existing booking' });

        return this.bookingsRepo.updateTimes({
            businessId: input.businessId,
            bookingId: booking.id,
            startAt: input.startAt,
            endAt,
            statusUpdatedById: input.actorUserId,
            ownerRescheduleReason: input.reason ?? null,
        });
    }
}

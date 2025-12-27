import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BOOKINGS_REPO, type BookingsRepoPort } from 'src/model/ports/repositories/bookings.repo.port';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';
import { GetAvailabilitySlotsUseCase } from 'src/modules/availability/use-cases/get-availability-slots.usecase';

import { EVENT_BUS, type EventBusPort } from 'src/common/events/event-bus.port';
import { bookingCreatedEvent } from 'src/model/domain/events/booking-created.event';

@Injectable()
export class CreateBookingPublicUseCase {
    constructor(
        @Inject(BOOKINGS_REPO) private readonly bookingsRepo: BookingsRepoPort,
        @Inject(SERVICES_REPO) private readonly servicesRepo: ServicesRepoPort,
        private readonly availabilityUC: GetAvailabilitySlotsUseCase,
        @Inject(EVENT_BUS) private readonly bus: EventBusPort,
    ) { }

    async exec(input: {
        customerId: string;
        businessId: string;
        serviceId: string;
        startAt: Date;
        staffId?: string;
        notes?: string | null;
    }) {
        const service = await this.servicesRepo.findForAvailability(input.serviceId);
        if (!service) throw new NotFoundException({ code: 'SERVICE_NOT_FOUND', message: 'Not found' });
        if (!service.isActive) throw new BadRequestException({ code: 'SERVICE_INACTIVE', message: 'Service inactive' });
        if (service.businessId !== input.businessId) {
            throw new BadRequestException({ code: 'SERVICE_WRONG_TENANT', message: 'Service not in this business' });
        }

        const startAtIso = input.startAt.toISOString();
        const date = startAtIso.slice(0, 10); // YYYY-MM-DD
        const endAt = new Date(input.startAt.getTime() + service.durationMin * 60_000);

        // 1) availability (hours + timeoff)
        const avail = await this.availabilityUC.exec({
            businessId: input.businessId,
            serviceId: input.serviceId,
            date,
            staffId: input.staffId,
        });

        const ok = avail.slots.some((s) => s.startAt === startAtIso && s.endAt === endAt.toISOString());
        if (!ok) {
            throw new BadRequestException({ code: 'SLOT_NOT_AVAILABLE', message: 'Selected slot is not available' });
        }

        // 2) overlap with existing bookings
        const overlap = await this.bookingsRepo.hasOverlap({
            businessId: input.businessId,
            startAt: input.startAt,
            endAt,
            staffId: input.staffId ?? null,
        });
        if (overlap) {
            throw new BadRequestException({ code: 'BOOKING_OVERLAP', message: 'Time overlaps with an existing booking' });
        }

        const created = await this.bookingsRepo.create({
            customerId: input.customerId,
            businessId: input.businessId,
            serviceId: input.serviceId,
            staffId: input.staffId ?? null,
            startAt: input.startAt,
            endAt,
            notes: input.notes ?? null,
        });

        // Observer: schedule notification jobs, etc.
        this.bus.publish(
            bookingCreatedEvent({
                bookingId: created.id,
                businessId: created.businessId,
            }),
        );

        return created;
    }
}

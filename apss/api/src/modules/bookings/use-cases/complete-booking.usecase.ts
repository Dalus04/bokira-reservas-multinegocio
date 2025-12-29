import { ForbiddenException, Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BOOKINGS_REPO, type BookingsRepoPort } from 'src/model/ports/repositories/bookings.repo.port';
import { EVENT_BUS, type EventBusPort } from 'src/common/events/event-bus.port';

@Injectable()
export class CompleteBookingUseCase {
    constructor(
        @Inject(BOOKINGS_REPO) private readonly repo: BookingsRepoPort,
        @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
    ) { }

    async exec(input: {
        businessId: string;
        bookingId: string;
        actorRole?: 'STAFF' | 'MANAGER';
        actorUserId: string;
    }) {
        const booking = await this.repo.findById(input.businessId, input.bookingId);
        if (!booking) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Not found' });

        // STAFF solo puede completar si la cita es suya
        if (input.actorRole === 'STAFF' && booking.staffId !== input.actorUserId) {
            throw new ForbiddenException({ code: 'FORBIDDEN', message: 'No access' });
        }

        // Regla de estado: recomendado CONFIRMED -> COMPLETED
        if (booking.status !== 'CONFIRMED') {
            throw new BadRequestException({
                code: 'BOOKING_INVALID_STATUS',
                message: 'Only CONFIRMED bookings can be completed',
            });
        }

        const updated = await this.repo.updateStatus({
            businessId: input.businessId,
            bookingId: booking.id,
            status: 'COMPLETED',
            statusUpdatedById: input.actorUserId,
            completedAt: new Date(),
        });

        // Domain Event
        this.eventBus.publish({
            name: 'booking.completed',
            occurredAt: new Date(),
            payload: {
                bookingId: updated.id,
                businessId: input.businessId,
                actorUserId: input.actorUserId,
            },
        });

        return updated;
    }
}

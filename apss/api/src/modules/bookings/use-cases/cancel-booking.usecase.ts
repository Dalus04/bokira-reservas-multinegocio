import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BOOKINGS_REPO, type BookingsRepoPort } from 'src/model/ports/repositories/bookings.repo.port';

import { EVENT_BUS, type EventBusPort } from 'src/common/events/event-bus.port';
import { bookingCancelledEvent } from 'src/model/domain/events/booking-cancelled.event';

@Injectable()
export class CancelBookingUseCase {
    constructor(
        @Inject(BOOKINGS_REPO) private readonly repo: BookingsRepoPort,
        @Inject(EVENT_BUS) private readonly bus: EventBusPort,
    ) { }

    async exec(input: {
        businessId: string;
        bookingId: string;
        reason?: string | null;
        actorRole?: 'STAFF' | 'MANAGER';
        actorUserId: string;
    }) {
        const booking = await this.repo.findById(input.businessId, input.bookingId);
        if (!booking) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Not found' });

        if (input.actorRole === 'STAFF' && booking.staffId !== input.actorUserId) {
            throw new ForbiddenException({ code: 'FORBIDDEN', message: 'No access' });
        }

        const updated = await this.repo.updateStatus({
            businessId: input.businessId,
            bookingId: input.bookingId,
            status: 'CANCELLED',
            statusUpdatedById: input.actorUserId,
            ownerCancelReason: input.reason ?? null,
        });

        this.bus.publish(
            bookingCancelledEvent({
                bookingId: updated.id,
                businessId: updated.businessId,
            }),
        );

        return updated;
    }
}

import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BOOKINGS_REPO, type BookingsRepoPort } from 'src/model/ports/repositories/bookings.repo.port';

@Injectable()
export class CancelBookingUseCase {
    constructor(@Inject(BOOKINGS_REPO) private readonly repo: BookingsRepoPort) { }

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

        return this.repo.updateStatus({
            businessId: input.businessId,
            bookingId: input.bookingId,
            status: 'CANCELLED',
            statusUpdatedById: input.actorUserId,
            ownerCancelReason: input.reason ?? null,
        });
    }
}

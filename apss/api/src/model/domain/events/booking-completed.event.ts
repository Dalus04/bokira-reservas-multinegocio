import type { DomainEvent } from './domain-event';

export type BookingCompletedEvent = DomainEvent & {
    name: 'booking.completed';
    payload: {
        bookingId: string;
        businessId: string;
        actorUserId: string;
    };
};

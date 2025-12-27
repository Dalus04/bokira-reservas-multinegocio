import type { DomainEvent } from './domain-event';

export type BookingCancelledPayload = {
    bookingId: string;
    businessId: string;
};

export const bookingCancelledEvent = (payload: BookingCancelledPayload): DomainEvent<'booking.cancelled', BookingCancelledPayload> => ({
    name: 'booking.cancelled',
    occurredAt: new Date(),
    payload,
});

import type { DomainEvent } from './domain-event';

export type BookingConfirmedPayload = {
    bookingId: string;
    businessId: string;
    actorUserId: string;
};

export const bookingConfirmedEvent = (
    payload: BookingConfirmedPayload,
): DomainEvent<'booking.confirmed', BookingConfirmedPayload> => ({
    name: 'booking.confirmed',
    occurredAt: new Date(),
    payload,
});

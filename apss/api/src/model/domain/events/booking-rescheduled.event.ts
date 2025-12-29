import type { DomainEvent } from './domain-event';

export type BookingRescheduledPayload = {
    bookingId: string;
    businessId: string;
    actorUserId: string;
};

export const bookingRescheduledEvent = (
    payload: BookingRescheduledPayload,
): DomainEvent<'booking.rescheduled', BookingRescheduledPayload> => ({
    name: 'booking.rescheduled',
    occurredAt: new Date(),
    payload,
});

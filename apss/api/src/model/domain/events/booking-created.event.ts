import type { DomainEvent } from "./domain-event";

export type BookingCreatedPayload = {
    bookingId: string;
    businessId: string;
};

export const bookingCreatedEvent = (payload: BookingCreatedPayload): DomainEvent<'booking.created', BookingCreatedPayload> => ({
    name: 'booking.created',
    occurredAt: new Date(),
    payload,
});

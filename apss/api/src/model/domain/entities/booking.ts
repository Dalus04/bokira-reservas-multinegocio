import type { BookingStatus } from '../enums/booking-status';

export type Booking = {
    id: string;
    customerId: string;
    businessId: string;
    serviceId: string;
    staffId: string | null;

    startAt: Date;
    endAt: Date;

    status: BookingStatus;
    notes: string | null;

    ownerConfirmNote: string | null;
    ownerCancelReason: string | null;
    ownerRescheduleReason: string | null;
    statusUpdatedById: string | null;

    createdAt: Date;
    updatedAt: Date;
};

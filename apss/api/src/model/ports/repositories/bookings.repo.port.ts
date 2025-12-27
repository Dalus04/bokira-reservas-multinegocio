import type { Booking } from "src/model/domain/entities/booking";

export const BOOKINGS_REPO = Symbol('BOOKINGS_REPO');

export type CreateBookingInput = {
    customerId: string;
    businessId: string;
    serviceId: string;
    staffId: string | null;
    startAt: Date;
    endAt: Date;
    notes?: string | null;
};

export type ListBookingsQuery = {
    businessId: string;
    from?: Date;
    to?: Date;
    status?: string;
    staffId?: string;
    page: number;
    limit: number;
};

export interface BookingsRepoPort {
    create(input: CreateBookingInput): Promise<Booking>;
    findById(businessId: string, bookingId: string): Promise<Booking | null>;
    list(q: ListBookingsQuery): Promise<{ items: Booking[]; total: number }>;

    hasOverlap(params: {
        businessId: string;
        startAt: Date;
        endAt: Date;
        staffId?: string | null;
        excludeBookingId?: string;
    }): Promise<boolean>;

    updateStatus(params: {
        businessId: string;
        bookingId: string;
        status: string;
        statusUpdatedById: string;
        ownerConfirmNote?: string | null;
        ownerCancelReason?: string | null;
        ownerRescheduleReason?: string | null;
    }): Promise<Booking>;

    updateTimes(params: {
        businessId: string;
        bookingId: string;
        startAt: Date;
        endAt: Date;
        statusUpdatedById: string;
        ownerRescheduleReason?: string | null;
    }): Promise<Booking>;
}

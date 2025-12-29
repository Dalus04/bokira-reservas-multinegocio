import type { LoyaltyReason } from 'src/model/domain/enums/loyalty';

export const LOYALTY_REPO = Symbol('LOYALTY_REPO');

export type LoyaltyAccountDTO = {
    id: string;
    businessId: string;
    customerId: string;
    points: number;
    createdAt: Date;
    updatedAt: Date;
};

export type LoyaltyEventDTO = {
    id: string;
    accountId: string;
    bookingId: string | null;
    reason: LoyaltyReason;
    pointsDelta: number;
    note: string | null;
    createdAt: Date;
};

export interface LoyaltyRepoPort {
    // para el subscriber: obtener contexto del booking (sin que use-case toque Prisma)
    getBookingLoyaltyContext(bookingId: string): Promise<{
        bookingId: string;
        businessId: string;
        customerId: string;
        price: string; // Decimal como string para no acoplar a Prisma.Decimal
    } | null>;

    // idempotencia: si ya existe el evento por (bookingId, reason) => no sumar
    addEarnFromCompletedBooking(input: {
        bookingId: string;
        reason: LoyaltyReason;
        note?: string | null;
        pointsDelta: number;
    }): Promise<{ applied: boolean; account?: LoyaltyAccountDTO }>;

    // web - customer
    listMyAccounts(userId: string): Promise<LoyaltyAccountDTO[]>;
    getMyAccount(input: { userId: string; businessId: string }): Promise<LoyaltyAccountDTO | null>;
    listMyEvents(input: { userId: string; businessId: string; page: number; limit: number }): Promise<{ items: LoyaltyEventDTO[]; total: number }>;

    // business - manager
    listBusinessAccounts(input: { businessId: string; page: number; limit: number; q?: string }): Promise<{ items: Array<LoyaltyAccountDTO & { customerEmail?: string | null }>; total: number }>;
}

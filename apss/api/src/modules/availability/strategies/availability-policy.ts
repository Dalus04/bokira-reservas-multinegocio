export type Slot = { startAt: string; endAt: string; staffId?: string };

export type AvailabilityContext = {
    businessId: string;
    date: string; // YYYY-MM-DD
    durationMin: number;
    slotStepMin: number;
    staffId?: string;

    businessHours: { openTime: string; closeTime: string; isClosed: boolean } | null;
    staffHours?: { startTime: string; endTime: string; isOff: boolean } | null;

    timeOffBlocks: { startAt: Date; endAt: Date; staffId: string | null }[];
};

export interface AvailabilityPolicy {
    buildSlots(ctx: AvailabilityContext): Slot[];
}

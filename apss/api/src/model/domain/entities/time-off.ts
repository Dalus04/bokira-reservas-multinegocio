export type TimeOff = {
    id: string;
    businessId: string;
    staffId: string | null;

    startAt: Date;
    endAt: Date;
    reason: string | null;

    createdAt: Date;
};

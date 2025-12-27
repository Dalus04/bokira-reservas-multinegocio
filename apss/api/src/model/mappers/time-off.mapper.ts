import type { TimeOff } from '../domain/entities/time-off';

type DbTimeOffLike = {
    id: string;
    businessId: string;
    staffId: string | null;
    startAt: Date;
    endAt: Date;
    reason: string | null;
    createdAt: Date;
};

export function toDomainTimeOff(row: DbTimeOffLike): TimeOff {
    return {
        id: row.id,
        businessId: row.businessId,
        staffId: row.staffId,
        startAt: row.startAt,
        endAt: row.endAt,
        reason: row.reason,
        createdAt: row.createdAt,
    };
}

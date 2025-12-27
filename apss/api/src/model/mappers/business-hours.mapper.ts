import type { BusinessHours } from '../domain/entities/business-hours';

type DbBusinessHoursLike = {
    id: string;
    businessId: string;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
};

export function toDomainBusinessHours(row: DbBusinessHoursLike): BusinessHours {
    return {
        id: row.id,
        businessId: row.businessId,
        dayOfWeek: row.dayOfWeek,
        openTime: row.openTime,
        closeTime: row.closeTime,
        isClosed: row.isClosed,
    };
}

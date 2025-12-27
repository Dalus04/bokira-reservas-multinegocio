import type { StaffWorkingHours } from '../domain/entities/staff-working-hours';

type DbStaffWorkingHoursLike = {
    id: string;
    businessId: string;
    staffId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isOff: boolean;
};

export function toDomainStaffWorkingHours(row: DbStaffWorkingHoursLike): StaffWorkingHours {
    return {
        id: row.id,
        businessId: row.businessId,
        staffId: row.staffId,
        dayOfWeek: row.dayOfWeek,
        startTime: row.startTime,
        endTime: row.endTime,
        isOff: row.isOff,
    };
}

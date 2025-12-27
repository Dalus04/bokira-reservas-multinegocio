import type { BusinessHours } from 'src/model/domain/entities/business-hours';
import type { StaffWorkingHours } from 'src/model/domain/entities/staff-working-hours';

export const AVAILABILITY_REPO = Symbol('AVAILABILITY_REPO');

export type BusinessHoursInput = {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
};

export type StaffHoursInput = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isOff: boolean;
};

export interface AvailabilityRepoPort {
    // BusinessHours
    listBusinessHours(businessId: string): Promise<BusinessHours[]>;
    upsertBusinessHours(businessId: string, weekly: BusinessHoursInput[]): Promise<BusinessHours[]>;

    // StaffWorkingHours
    listStaffWorkingHours(businessId: string, staffId: string): Promise<StaffWorkingHours[]>;
    upsertStaffWorkingHours(businessId: string, staffId: string, weekly: StaffHoursInput[]): Promise<StaffWorkingHours[]>;
}

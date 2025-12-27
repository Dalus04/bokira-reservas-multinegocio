export type StaffWorkingHours = {
    id: string;
    businessId: string;
    staffId: string;
    dayOfWeek: number; // 0-6
    startTime: string; // "09:00"
    endTime: string;   // "18:00"
    isOff: boolean;
};

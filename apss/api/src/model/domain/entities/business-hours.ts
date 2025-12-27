export type BusinessHours = {
    id: string;
    businessId: string;
    dayOfWeek: number; // 0-6
    openTime: string;  // "09:00"
    closeTime: string; // "18:00"
    isClosed: boolean;
};

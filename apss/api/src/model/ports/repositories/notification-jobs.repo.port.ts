import {
    NotificationAudience,
    NotificationChannel,
    NotificationStatus,
    NotificationType,
} from 'src/model/domain/enums/notification';

export const NOTIFICATION_JOBS_REPO = Symbol('NOTIFICATION_JOBS_REPO');

export type CreateJobInput = {
    type: NotificationType;
    channel: NotificationChannel;
    audience: NotificationAudience; // ✅ nuevo
    bookingId: string;
    userId: string;
    sendAt: Date;
};

export type ListJobsQuery = {
    status?: NotificationStatus;
    page: number;
    limit: number;
};

export type NotificationJobDTO = {
    id: string;
    type: NotificationType;
    channel: NotificationChannel;
    audience: NotificationAudience; // ✅ nuevo
    bookingId: string;
    userId: string;
    sendAt: Date;
    status: NotificationStatus;
    readAt: Date | null; // ✅ para inbox
    attempts: number;
    lastError: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export interface NotificationJobsRepoPort {
    createManyIgnoreDuplicates(items: CreateJobInput[]): Promise<{ attempted: number }>;
    list(q: ListJobsQuery): Promise<{ items: NotificationJobDTO[]; total: number }>;
    pickDue(limit: number, now: Date): Promise<NotificationJobDTO[]>;
    markProcessing(jobId: string): Promise<void>;
    markSent(jobId: string): Promise<void>;
    markFailed(jobId: string, error: string): Promise<void>;
    cancelForBooking(bookingId: string): Promise<void>;

    // ✅ contexto para mensajes (ahora incluye staffId)
    getBookingNotificationContext(bookingId: string): Promise<{
        bookingId: string;
        startAt: Date;
        customerId: string;
        staffId: string | null;
        business: { id: string; timezone: string; isActive: boolean; status: string };
    } | null>;

    // inbox
    listForUser(input: { userId: string; page: number; limit: number }): Promise<{ items: NotificationJobDTO[]; total: number }>;
    countUnreadForUser(userId: string): Promise<number>;
    markRead(input: { userId: string; jobId: string }): Promise<void>;
}

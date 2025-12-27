import { NotificationChannel, NotificationStatus, NotificationType } from 'src/model/domain/enums/notification';

export const NOTIFICATION_JOBS_REPO = Symbol('NOTIFICATION_JOBS_REPO');

export type CreateJobInput = {
    type: NotificationType;
    channel: NotificationChannel;
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
    bookingId: string;
    userId: string;
    sendAt: Date;
    status: NotificationStatus;
    attempts: number;
    lastError: string | null;
    createdAt: Date;
    updatedAt: Date;

    // ✅ in-app
    readAt?: Date | null;
};

export interface NotificationJobsRepoPort {
    createManyIgnoreDuplicates(items: CreateJobInput[]): Promise<{ attempted: number }>;
    list(q: ListJobsQuery): Promise<{ items: NotificationJobDTO[]; total: number }>;
    pickDue(limit: number, now: Date): Promise<NotificationJobDTO[]>;
    markProcessing(jobId: string): Promise<void>;
    markSent(jobId: string): Promise<void>;
    markFailed(jobId: string, error: string): Promise<void>;
    cancelForBooking(bookingId: string): Promise<void>;

    // Contexto para armar mensajes sin Prisma en use-case
    getBookingNotificationContext(bookingId: string): Promise<{
        bookingId: string;
        startAt: Date;
        customerId: string;
        business: { id: string; timezone: string; isActive: boolean; status: string };
    } | null>;

    // IN-APP (campana)
    listForUser(input: {
        userId: string;
        page: number;
        limit: number;
        status?: NotificationStatus;
    }): Promise<{ items: NotificationJobDTO[]; total: number }>;
    countUnreadForUser(input: { userId: string }): Promise<number>
    markRead(input: { userId: string; jobId: string }): Promise<void>;
}

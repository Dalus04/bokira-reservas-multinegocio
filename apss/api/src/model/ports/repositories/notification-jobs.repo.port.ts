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
};

export interface NotificationJobsRepoPort {
    createManyIgnoreDuplicates(items: CreateJobInput[]): Promise<{ attempted: number }>;
    list(q: ListJobsQuery): Promise<{ items: NotificationJobDTO[]; total: number }>;
    pickDue(limit: number, now: Date): Promise<NotificationJobDTO[]>;
    markProcessing(jobId: string): Promise<void>;
    markSent(jobId: string): Promise<void>;
    markFailed(jobId: string, error: string): Promise<void>;
    cancelForBooking(bookingId: string): Promise<void>;

    // Para construir mensajes sin que use-case toque Prisma
    getBookingNotificationContext(bookingId: string): Promise<{
        bookingId: string;
        startAt: Date;
        customerId: string;
        business: { id: string; timezone: string; isActive: boolean; status: string };
    } | null>;
}

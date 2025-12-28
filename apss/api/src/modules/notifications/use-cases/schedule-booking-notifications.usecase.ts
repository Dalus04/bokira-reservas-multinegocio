import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';
import { NotificationAudience, NotificationChannel, NotificationType } from 'src/model/domain/enums/notification';

function clampSendAt(sendAt: Date) {
    const now = new Date();
    return sendAt.getTime() < now.getTime() ? now : sendAt;
}

@Injectable()
export class ScheduleBookingNotificationsUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly jobsRepo: NotificationJobsRepoPort,
    ) { }

    async exec(input: { bookingId: string; businessId: string }) {
        const ctx = await this.jobsRepo.getBookingNotificationContext(input.bookingId);
        if (!ctx) {
            throw new BadRequestException({ code: 'BOOKING_CONTEXT_NOT_FOUND', message: 'Not found' });
        }

        if (ctx.business.id !== input.businessId) {
            throw new BadRequestException({ code: 'BOOKING_WRONG_TENANT', message: 'Wrong tenant' });
        }

        if (!ctx.business.isActive) {
            return { scheduled: 0, reason: 'BUSINESS_INACTIVE' };
        }

        // 24h antes
        const sendAt24h = clampSendAt(new Date(ctx.startAt.getTime() - 24 * 60 * 60 * 1000));

        // hoy 8am (MVP UTC). Luego lo hacemos real con luxon timezone.
        const ymd = ctx.startAt.toISOString().slice(0, 10);
        const sendAt8am = clampSendAt(new Date(`${ymd}T08:00:00.000Z`));

        const jobs = [
            // CUSTOMER
            {
                type: NotificationType.BOOKING_REMINDER_24H,
                channel: NotificationChannel.EMAIL,
                audience: NotificationAudience.CUSTOMER,
                bookingId: ctx.bookingId,
                userId: ctx.customerId,
                sendAt: sendAt24h,
            },
            {
                type: NotificationType.BOOKING_REMINDER_TODAY_8AM,
                channel: NotificationChannel.EMAIL,
                audience: NotificationAudience.CUSTOMER,
                bookingId: ctx.bookingId,
                userId: ctx.customerId,
                sendAt: sendAt8am,
            },
        ];

        // STAFF (si existe staffId)
        if (ctx.staffId) {
            jobs.push(
                {
                    type: NotificationType.BOOKING_REMINDER_24H,
                    channel: NotificationChannel.EMAIL,
                    audience: NotificationAudience.STAFF,
                    bookingId: ctx.bookingId,
                    userId: ctx.staffId,
                    sendAt: sendAt24h,
                },
                {
                    type: NotificationType.BOOKING_REMINDER_TODAY_8AM,
                    channel: NotificationChannel.EMAIL,
                    audience: NotificationAudience.STAFF,
                    bookingId: ctx.bookingId,
                    userId: ctx.staffId,
                    sendAt: sendAt8am,
                },
            );
        }

        await this.jobsRepo.createManyIgnoreDuplicates(jobs);
        return { scheduled: jobs.length, timezone: ctx.business.timezone };
    }
}

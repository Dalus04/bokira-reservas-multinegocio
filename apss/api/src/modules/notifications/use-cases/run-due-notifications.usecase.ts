import { Inject, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';
import { NOTIFICATION_CHANNEL_SENDER, type NotificationChannelSenderPort } from 'src/model/ports/integrations/notification-channel.port';
import { NotificationAudience, NotificationChannel, NotificationStatus, NotificationType } from 'src/model/domain/enums/notification';

@Injectable()
export class RunDueNotificationsUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly jobsRepo: NotificationJobsRepoPort,
        @Inject(NOTIFICATION_CHANNEL_SENDER) private readonly sender: NotificationChannelSenderPort,
    ) { }

    async exec(input: { limit: number; dryRun: boolean }) {
        const now = new Date();
        const due = await this.jobsRepo.pickDue(input.limit, now);

        const results = {
            now: now.toISOString(),
            picked: due.length,
            processed: 0,
            sent: 0,
            failed: 0,
            dryRun: input.dryRun,
            items: [] as Array<{ jobId: string; status: NotificationStatus | 'DRY_RUN'; error?: string }>,
        };

        for (const job of due) {
            results.processed++;

            if (input.dryRun) {
                results.items.push({ jobId: job.id, status: 'DRY_RUN' });
                continue;
            }

            try {
                await this.jobsRepo.markProcessing(job.id);

                const ctx = await this.jobsRepo.getBookingNotificationContext(job.bookingId);
                if (!ctx) {
                    await this.jobsRepo.markFailed(job.id, 'BOOKING_CONTEXT_NOT_FOUND');
                    results.failed++;
                    results.items.push({ jobId: job.id, status: NotificationStatus.FAILED, error: 'BOOKING_CONTEXT_NOT_FOUND' });
                    continue;
                }

                const { title, body } = this.buildMessage(
                    job.type,
                    job.audience as NotificationAudience,
                    ctx.startAt,
                    ctx.business.timezone,
                );

                await this.sender.send({
                    channel: job.channel as NotificationChannel,
                    toUserId: job.userId,
                    title,
                    body,
                });

                await this.jobsRepo.markSent(job.id);
                results.sent++;
                results.items.push({ jobId: job.id, status: NotificationStatus.SENT });
            } catch (err: any) {
                const msg = (err?.message ?? String(err)).slice(0, 500);
                await this.jobsRepo.markFailed(job.id, msg);
                results.failed++;
                results.items.push({ jobId: job.id, status: NotificationStatus.FAILED, error: msg });
            }
        }

        return results;
    }

    private fmtFull12h(startAt: Date, timezone: string) {
        return DateTime.fromJSDate(startAt, { zone: 'utc' })
            .setZone(timezone)
            .setLocale('es')
            .toFormat("cccc dd 'de' LLLL yyyy, h:mm a");
    }

    private buildMessage(type: NotificationType, audience: NotificationAudience, startAt: Date, timezone: string) {
        const when = this.fmtFull12h(startAt, timezone);

        const isStaff = audience === NotificationAudience.STAFF;

        if (type === NotificationType.BOOKING_REMINDER_24H) {
            return {
                title: isStaff ? 'Recordatorio de cita (24h)' : 'Recordatorio de reserva (24h)',
                body: isStaff
                    ? `Tienes una cita programada para ${when}.`
                    : `Tu reserva es pronto: ${when}.`,
            };
        }

        if (type === NotificationType.BOOKING_REMINDER_TODAY_8AM) {
            return {
                title: isStaff ? 'Citas de hoy' : 'Reserva de hoy',
                body: isStaff
                    ? `Hoy tienes una cita: ${when}.`
                    : `Hoy tienes una reserva: ${when}.`,
            };
        }

        return {
            title: 'Notificación Bokira',
            body: isStaff ? `Actualización de tu cita: ${when}.` : `Actualización de tu reserva: ${when}.`,
        };
    }
}

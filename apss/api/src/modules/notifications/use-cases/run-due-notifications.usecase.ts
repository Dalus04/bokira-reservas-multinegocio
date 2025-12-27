import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';
import { NOTIFICATION_CHANNEL_SENDER, type NotificationChannelSenderPort } from 'src/model/ports/integrations/notification-channel.port';
import { NotificationChannel, NotificationStatus } from 'src/model/domain/enums/notification';

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
            items: [] as Array<{
                jobId: string;
                status: NotificationStatus | 'DRY_RUN';
                error?: string;
            }>,
        };

        for (const job of due) {
            results.processed++;

            if (input.dryRun) {
                results.items.push({ jobId: job.id, status: 'DRY_RUN' });
                continue;
            }

            try {
                await this.jobsRepo.markProcessing(job.id);

                // Contexto mínimo para armar mensaje sin Prisma
                const ctx = await this.jobsRepo.getBookingNotificationContext(job.bookingId);
                if (!ctx) {
                    await this.jobsRepo.markFailed(job.id, 'BOOKING_CONTEXT_NOT_FOUND');
                    results.failed++;
                    results.items.push({ jobId: job.id, status: NotificationStatus.FAILED, error: 'BOOKING_CONTEXT_NOT_FOUND' });
                    continue;
                }

                const { title, body } = this.buildMessage(job.type, ctx.startAt, ctx.business.timezone);

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

    private buildMessage(type: any, startAt: Date, timezone: string) {
        // MVP: texto simple. Luego mejorar con plantillas.
        const start = startAt.toISOString();

        if (type === 'BOOKING_REMINDER_24H') {
            return {
                title: 'Recordatorio de reserva (24h)',
                body: `Tu reserva es pronto. Fecha/hora: ${start} (tz: ${timezone}).`,
            };
        }

        if (type === 'BOOKING_REMINDER_TODAY_8AM') {
            return {
                title: 'Recordatorio de reserva (hoy)',
                body: `Hoy tienes una reserva. Fecha/hora: ${start} (tz: ${timezone}).`,
            };
        }

        return {
            title: 'Notificación Bokira',
            body: `Tienes una actualización de tu reserva. Fecha/hora: ${start} (tz: ${timezone}).`,
        };
    }
}

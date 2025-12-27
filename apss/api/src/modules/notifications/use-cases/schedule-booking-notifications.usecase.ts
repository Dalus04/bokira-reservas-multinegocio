import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';
import { NotificationChannel, NotificationType } from 'src/model/domain/enums/notification';

// Util simple: construir Date local en tz sin librerías (MVP)
function clampSendAt(sendAt: Date) {
    // no enviar en el pasado: si está vencido, se manda "ahora"
    const now = new Date();
    return sendAt.getTime() < now.getTime() ? now : sendAt;
}

@Injectable()
export class ScheduleBookingNotificationsUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly jobsRepo: NotificationJobsRepoPort,
    ) { }

    async exec(input: {
        bookingId: string;
        businessId: string;
    }) {
        const ctx = await this.jobsRepo.getBookingNotificationContext(input.bookingId);
        if (!ctx) {
            throw new BadRequestException({ code: 'BOOKING_CONTEXT_NOT_FOUND', message: 'Not found' });
        }

        // Seguridad: debe ser del mismo business
        if (ctx.business.id !== input.businessId) {
            throw new BadRequestException({ code: 'BOOKING_WRONG_TENANT', message: 'Wrong tenant' });
        }

        // Solo si negocio activo (si está suspendido, igual puedes decidir cancelar)
        if (!ctx.business.isActive) {
            return { scheduled: 0, reason: 'BUSINESS_INACTIVE' };
        }

        // ======= Cálculo de sendAt =======
        // 1) 24h antes del startAt
        const sendAt24h = clampSendAt(new Date(ctx.startAt.getTime() - 24 * 60 * 60 * 1000));

        // 2) mismo día 8:00 am (timezone)
        // MVP sin librerías: calculamos el "día" del startAt en UTC y fijamos 08:00 UTC.
        // ✅ Para prod: usar luxon/dayjs-timezone con ctx.business.timezone.
        const startIso = ctx.startAt.toISOString(); // yyyy-mm-ddTHH:mm:ssZ
        const ymd = startIso.slice(0, 10);
        const sendAt8am = clampSendAt(new Date(`${ymd}T08:00:00.000Z`));

        // ======= Jobs =======
        const jobs = [
            {
                type: NotificationType.BOOKING_REMINDER_24H,
                channel: NotificationChannel.EMAIL,
                bookingId: ctx.bookingId,
                userId: ctx.customerId,
                sendAt: sendAt24h,
            },
            {
                type: NotificationType.BOOKING_REMINDER_TODAY_8AM,
                channel: NotificationChannel.EMAIL,
                bookingId: ctx.bookingId,
                userId: ctx.customerId,
                sendAt: sendAt8am,
            },
        ];

        await this.jobsRepo.createManyIgnoreDuplicates(jobs);
        return { scheduled: jobs.length, timezone: ctx.business.timezone };
    }
}

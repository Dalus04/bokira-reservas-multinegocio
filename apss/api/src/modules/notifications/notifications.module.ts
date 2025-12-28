import { Module } from '@nestjs/common';

import { NotificationsAdminController } from './notifications.admin.controller';
import { NotificationsController } from './notifications.controller';

import { NotificationJobsPrismaRepo } from 'src/infra/prisma/repositories/notification-jobs.prisma.repo';
import { notificationJobsRepoProvider } from 'src/infra/prisma/repositories/notification-jobs.repo.provider';

import { MockNotificationSenderAdapter } from 'src/infra/integrations/notifications/mock-notification-sender.adapter';
import { notificationSenderProvider } from 'src/infra/integrations/notifications/notification-sender.provider';

import { ListNotificationJobsUseCase } from './use-cases/list-notification-jobs.usecase';
import { RunDueNotificationsUseCase } from './use-cases/run-due-notifications.usecase';
import { ScheduleBookingNotificationsUseCase } from './use-cases/schedule-booking-notifications.usecase';
import { CancelBookingNotificationsUseCase } from './use-cases/cancel-booking-notifications.usecase';

import { BookingEventsSubscriber } from './subscribers/booking-events.subscriber';

import { ListMyNotificationsUseCase } from './use-cases/list-my-notifications.usecase';
import { GetMyUnreadCountUseCase } from './use-cases/get-my-unread-count.usecase';
import { MarkNotificationReadUseCase } from './use-cases/mark-notification-read.usecase';

import { NotificationsCron } from './notifications.cron';
import { NotificationsWorker } from './workers/notifications.worker';

@Module({
    controllers: [NotificationsAdminController, NotificationsController],
    providers: [
        // repos
        NotificationJobsPrismaRepo,
        notificationJobsRepoProvider,

        // sender adapter (MVP: log)
        MockNotificationSenderAdapter,
        notificationSenderProvider,

        // use-cases
        ListNotificationJobsUseCase,
        RunDueNotificationsUseCase,
        ScheduleBookingNotificationsUseCase,
        CancelBookingNotificationsUseCase,

        // user notifications
        ListMyNotificationsUseCase,
        GetMyUnreadCountUseCase,
        MarkNotificationReadUseCase,

        // observer
        BookingEventsSubscriber,

        // cron worker (AUTO)
        NotificationsCron,

        NotificationsWorker,
    ],
})
export class NotificationsModule { }

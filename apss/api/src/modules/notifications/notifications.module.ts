import { Module } from '@nestjs/common';

import { NotificationsAdminController } from './notifications.admin.controller';

import { NotificationJobsPrismaRepo } from 'src/infra/prisma/repositories/notification-jobs.prisma.repo';
import { notificationJobsRepoProvider } from 'src/infra/prisma/repositories/notification-jobs.repo.provider';

import { MockNotificationSenderAdapter } from 'src/infra/integrations/notifications/mock-notification-sender.adapter';
import { notificationSenderProvider } from 'src/infra/integrations/notifications/notification-sender.provider';

import { ListNotificationJobsUseCase } from './use-cases/list-notification-jobs.usecase';
import { RunDueNotificationsUseCase } from './use-cases/run-due-notifications.usecase';
import { ScheduleBookingNotificationsUseCase } from './use-cases/schedule-booking-notifications.usecase';
import { CancelBookingNotificationsUseCase } from './use-cases/cancel-booking-notifications.usecase';

import { BookingEventsSubscriber } from './subscribers/booking-events.subscriber';

@Module({
    controllers: [NotificationsAdminController],
    providers: [
        // repos
        NotificationJobsPrismaRepo,
        notificationJobsRepoProvider,

        // channel sender adapter (Strategy por canal se implementa dentro del adapter / sender)
        MockNotificationSenderAdapter,
        notificationSenderProvider,

        // use-cases
        ListNotificationJobsUseCase,
        RunDueNotificationsUseCase,
        ScheduleBookingNotificationsUseCase,
        CancelBookingNotificationsUseCase,

        // observer
        BookingEventsSubscriber,
    ],
})
export class NotificationsModule { }

import { NotificationChannel } from 'src/model/domain/enums/notification';

export const NOTIFICATION_CHANNEL_SENDER = Symbol('NOTIFICATION_CHANNEL_SENDER');

export type SendNotificationInput = {
    channel: NotificationChannel;
    toUserId: string;
    title: string;
    body: string;
};

export interface NotificationChannelSenderPort {
    send(input: SendNotificationInput): Promise<void>;
}

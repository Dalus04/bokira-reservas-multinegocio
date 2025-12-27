import { NOTIFICATION_CHANNEL_SENDER } from 'src/model/ports/integrations/notification-channel.port';
import { MockNotificationSenderAdapter } from './mock-notification-sender.adapter';

export const notificationSenderProvider = {
    provide: NOTIFICATION_CHANNEL_SENDER,
    useClass: MockNotificationSenderAdapter,
};

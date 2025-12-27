import { Injectable, Logger } from '@nestjs/common';
import type { NotificationChannelSenderPort, SendNotificationInput } from 'src/model/ports/integrations/notification-channel.port';

@Injectable()
export class MockNotificationSenderAdapter implements NotificationChannelSenderPort {
    private readonly logger = new Logger(MockNotificationSenderAdapter.name);

    async send(input: SendNotificationInput): Promise<void> {
        // MVP: solo log. reemplazar por Email/WhatsApp/Push reales.
        this.logger.log(`[${input.channel}] toUserId=${input.toUserId} title="${input.title}" body="${input.body}"`);
    }
}

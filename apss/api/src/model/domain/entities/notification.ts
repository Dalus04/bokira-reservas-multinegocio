import type { NotificationChannel, NotificationStatus, NotificationType } from '../enums/notification';

export type NotificationListItem = {
    id: string;

    type: NotificationType;
    channel: NotificationChannel;
    status: NotificationStatus;

    sendAt: Date;
    readAt: Date | null;

    bookingId: string;

    // Para UI (campana / lista)
    business: { id: string; name: string; slug: string };
    service: { id: string; name: string } | null;

    // MVP: texto derivado (no lo guardamos en DB)
    title: string;
    body: string;

    createdAt: Date;
};

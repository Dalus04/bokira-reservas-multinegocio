export enum NotificationType {
    BOOKING_REMINDER_24H = 'BOOKING_REMINDER_24H',
    BOOKING_REMINDER_TODAY_8AM = 'BOOKING_REMINDER_TODAY_8AM',
}

export enum NotificationChannel {
    EMAIL = 'EMAIL',
    WHATSAPP = 'WHATSAPP',
    PUSH = 'PUSH',
}

export enum NotificationStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export enum NotificationAudience {
    CUSTOMER = 'CUSTOMER',
    STAFF = 'STAFF',
}

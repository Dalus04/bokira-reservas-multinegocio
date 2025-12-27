import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EVENT_BUS, type EventBusPort } from 'src/common/events/event-bus.port';
import type { DomainEvent } from 'src/model/domain/events/domain-event';

import { ScheduleBookingNotificationsUseCase } from '../use-cases/schedule-booking-notifications.usecase';
import { CancelBookingNotificationsUseCase } from '../use-cases/cancel-booking-notifications.usecase';

@Injectable()
export class BookingEventsSubscriber implements OnModuleInit {
    private readonly logger = new Logger(BookingEventsSubscriber.name);

    constructor(
        @Inject(EVENT_BUS) private readonly bus: EventBusPort,
        private readonly scheduleUC: ScheduleBookingNotificationsUseCase,
        private readonly cancelUC: CancelBookingNotificationsUseCase,
    ) { }

    onModuleInit() {
        this.bus.subscribe('booking.created', (e) => this.onBookingCreated(e));
        this.bus.subscribe('booking.confirmed', (e) => this.onBookingCreated(e)); // opcional: también agenda al confirmar
        this.bus.subscribe('booking.rescheduled', (e) => this.onBookingRescheduled(e));
        this.bus.subscribe('booking.cancelled', (e) => this.onBookingCancelled(e));
    }

    private async onBookingCreated(event: DomainEvent) {
        try {
            const { bookingId, businessId } = event.payload as any;
            await this.scheduleUC.exec({ bookingId, businessId });
        } catch (err: any) {
            this.logger.error(`schedule failed: ${err?.message ?? String(err)}`);
        }
    }

    private async onBookingRescheduled(event: DomainEvent) {
        try {
            const { bookingId, businessId } = event.payload as any;
            // Re-agenda: cancela y vuelve a crear
            await this.cancelUC.exec({ bookingId });
            await this.scheduleUC.exec({ bookingId, businessId });
        } catch (err: any) {
            this.logger.error(`reschedule schedule failed: ${err?.message ?? String(err)}`);
        }
    }

    private async onBookingCancelled(event: DomainEvent) {
        try {
            const { bookingId } = event.payload as any;
            await this.cancelUC.exec({ bookingId });
        } catch (err: any) {
            this.logger.error(`cancel jobs failed: ${err?.message ?? String(err)}`);
        }
    }
}

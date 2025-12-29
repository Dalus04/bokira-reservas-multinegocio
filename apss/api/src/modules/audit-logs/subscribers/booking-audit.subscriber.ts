import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EVENT_BUS, type EventBusPort } from 'src/common/events/event-bus.port';
import type { DomainEvent } from 'src/model/domain/events/domain-event';

import { WriteAuditLogUseCase } from '../use-cases/write-audit-log.usecase';
import { AuditAction, AuditEntityType } from 'src/model/domain/enums/audit';

type BookingEventPayload = {
    bookingId: string;
    businessId: string;
    actorUserId: string;
};

@Injectable()
export class BookingAuditSubscriber implements OnModuleInit {
    constructor(
        @Inject(EVENT_BUS) private readonly bus: EventBusPort,
        private readonly writeUC: WriteAuditLogUseCase,
    ) { }

    onModuleInit() {
        this.bus.subscribe('booking.confirmed', (e) => this.onBooking(e));
        this.bus.subscribe('booking.cancelled', (e) => this.onBooking(e));
        this.bus.subscribe('booking.rescheduled', (e) => this.onBooking(e));
        this.bus.subscribe('booking.completed', (e) => this.onBooking(e));
        this.bus.subscribe('booking.created', (e) => this.onBooking(e)); // opcional
    }

    private async onBooking(event: DomainEvent<string, any>) {
        const p = event.payload as BookingEventPayload;

        const action = this.mapAction(event.name);
        if (!action) return;

        await this.writeUC.exec({
            actorUserId: p.actorUserId,
            businessId: p.businessId,
            entityType: AuditEntityType.BOOKING,
            entityId: p.bookingId,
            action,
            metadata: {
                event: event.name,
                occurredAt: event.occurredAt,
            },
        });
    }

    private mapAction(eventName: string): AuditAction | null {
        if (eventName === 'booking.confirmed') return AuditAction.CONFIRM;
        if (eventName === 'booking.cancelled') return AuditAction.CANCEL;
        if (eventName === 'booking.rescheduled') return AuditAction.RESCHEDULE;
        if (eventName === 'booking.completed') return AuditAction.COMPLETE;
        if (eventName === 'booking.created') return AuditAction.CREATE;
        return null;
    }
}

import { Injectable, Logger } from '@nestjs/common';
import type { DomainEvent } from 'src/model/domain/events/domain-event';
import type { DomainEventHandler, EventBusPort } from './event-bus.port';

@Injectable()
export class InMemoryEventBus implements EventBusPort {
    private readonly logger = new Logger(InMemoryEventBus.name);
    private readonly handlers = new Map<string, DomainEventHandler[]>();

    publish(event: DomainEvent): void {
        const list = this.handlers.get(event.name) ?? [];
        if (list.length === 0) return;

        // fire & forget (no bloquea request)
        for (const h of list) {
            Promise.resolve()
                .then(() => h(event))
                .catch((err) => this.logger.error(`handler failed for ${event.name}`, err?.stack ?? String(err)));
        }
    }

    subscribe(eventName: string, handler: DomainEventHandler): void {
        const list = this.handlers.get(eventName) ?? [];
        list.push(handler);
        this.handlers.set(eventName, list);
    }
}

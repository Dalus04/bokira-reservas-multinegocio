import type { DomainEvent } from 'src/model/domain/events/domain-event';

export const EVENT_BUS = Symbol('EVENT_BUS');

export type DomainEventHandler = (event: DomainEvent) => void | Promise<void>;

export interface EventBusPort {
    publish(event: DomainEvent): void;
    subscribe(eventName: string, handler: DomainEventHandler): void;
}

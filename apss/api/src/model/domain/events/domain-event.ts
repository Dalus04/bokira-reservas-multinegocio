export type DomainEvent<TName extends string = string, TPayload = unknown> = {
    name: TName;
    occurredAt: Date;
    payload: TPayload;
};

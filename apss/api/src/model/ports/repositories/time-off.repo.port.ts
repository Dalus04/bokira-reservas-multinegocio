import type { TimeOff } from 'src/model/domain/entities/time-off';

export const TIME_OFF_REPO = Symbol('TIME_OFF_REPO');

export type ListTimeOffQuery = {
    businessId: string;
    staffId?: string;
    from?: Date;
    to?: Date;
};

export type CreateTimeOffInput = {
    businessId: string;
    staffId: string | null;
    startAt: Date;
    endAt: Date;
    reason?: string | null;
};

export type UpdateTimeOffInput = {
    startAt?: Date;
    endAt?: Date;
    reason?: string | null;
};

export interface TimeOffRepoPort {
    list(q: ListTimeOffQuery): Promise<TimeOff[]>;
    create(input: CreateTimeOffInput): Promise<TimeOff>;
    findById(businessId: string, timeOffId: string): Promise<TimeOff | null>;
    update(businessId: string, timeOffId: string, data: UpdateTimeOffInput): Promise<TimeOff>;
    delete(businessId: string, timeOffId: string): Promise<void>;
}

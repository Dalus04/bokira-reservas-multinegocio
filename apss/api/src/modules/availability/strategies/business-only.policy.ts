import { addMinutes, dateAtUtc, overlaps } from 'src/common/utils/time';
import type { AvailabilityContext, AvailabilityPolicy, Slot } from './availability-policy';

export class BusinessOnlyPolicy implements AvailabilityPolicy {
    buildSlots(ctx: AvailabilityContext): Slot[] {
        if (!ctx.businessHours || ctx.businessHours.isClosed) return [];

        const start = dateAtUtc(ctx.date, ctx.businessHours.openTime);
        const end = dateAtUtc(ctx.date, ctx.businessHours.closeTime);

        const slots: Slot[] = [];
        for (let t = start; addMinutes(t, ctx.durationMin) <= end; t = addMinutes(t, ctx.slotStepMin)) {
            const slotStart = t;
            const slotEnd = addMinutes(t, ctx.durationMin);

            const blocked = ctx.timeOffBlocks.some((b) => overlaps(slotStart, slotEnd, b.startAt, b.endAt));
            if (blocked) continue;

            slots.push({ startAt: slotStart.toISOString(), endAt: slotEnd.toISOString() });
        }
        return slots;
    }
}

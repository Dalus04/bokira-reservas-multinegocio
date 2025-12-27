import { addMinutes, dateAtUtc, overlaps } from 'src/common/utils/time';
import type { AvailabilityContext, AvailabilityPolicy, Slot } from './availability-policy';

export class StaffPolicy implements AvailabilityPolicy {
    buildSlots(ctx: AvailabilityContext): Slot[] {
        if (!ctx.staffId) return [];
        if (!ctx.businessHours || ctx.businessHours.isClosed) return [];
        if (!ctx.staffHours || ctx.staffHours.isOff) return [];

        // Ventana negocio
        const bizStart = dateAtUtc(ctx.date, ctx.businessHours.openTime);
        const bizEnd = dateAtUtc(ctx.date, ctx.businessHours.closeTime);

        // Ventana staff
        const staffStart = dateAtUtc(ctx.date, ctx.staffHours.startTime);
        const staffEnd = dateAtUtc(ctx.date, ctx.staffHours.endTime);

        const start = staffStart > bizStart ? staffStart : bizStart;
        const end = staffEnd < bizEnd ? staffEnd : bizEnd;

        const slots: Slot[] = [];
        for (let t = start; addMinutes(t, ctx.durationMin) <= end; t = addMinutes(t, ctx.slotStepMin)) {
            const slotStart = t;
            const slotEnd = addMinutes(t, ctx.durationMin);

            const blocked = ctx.timeOffBlocks.some((b) => {
                // bloqueos del negocio (staffId null) o del mismo staff
                const applies = b.staffId === null || b.staffId === ctx.staffId;
                return applies && overlaps(slotStart, slotEnd, b.startAt, b.endAt);
            });

            if (blocked) continue;

            slots.push({ startAt: slotStart.toISOString(), endAt: slotEnd.toISOString(), staffId: ctx.staffId });
        }
        return slots;
    }
}

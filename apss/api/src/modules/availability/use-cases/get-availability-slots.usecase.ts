import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';
import { AVAILABILITY_REPO, type AvailabilityRepoPort } from 'src/model/ports/repositories/availability.repo.port';
import { TIME_OFF_REPO, type TimeOffRepoPort } from 'src/model/ports/repositories/time-off.repo.port';
import { BusinessOnlyPolicy } from '../strategies/business-only.policy';
import { StaffPolicy } from '../strategies/staff.policy';

@Injectable()
export class GetAvailabilitySlotsUseCase {
    private readonly slotStepMin = 15;

    constructor(
        @Inject(SERVICES_REPO) private readonly servicesRepo: ServicesRepoPort,
        @Inject(AVAILABILITY_REPO) private readonly availabilityRepo: AvailabilityRepoPort,
        @Inject(TIME_OFF_REPO) private readonly timeOffRepo: TimeOffRepoPort,
    ) { }

    async exec(input: {
        businessId: string;
        serviceId: string;
        date: string; // YYYY-MM-DD
        staffId?: string;
    }) {
        const service = await this.servicesRepo.findForAvailability(input.serviceId);
        if (!service) throw new NotFoundException({ code: 'SERVICE_NOT_FOUND', message: 'Not found' });
        if (!service.isActive) throw new BadRequestException({ code: 'SERVICE_INACTIVE', message: 'Service inactive' });
        if (service.businessId !== input.businessId) {
            throw new BadRequestException({ code: 'SERVICE_WRONG_TENANT', message: 'Service not in this business' });
        }

        const businessHoursAll = await this.availabilityRepo.listBusinessHours(input.businessId);
        const bh = businessHoursAll.find((x) => x.dayOfWeek === this.dayOfWeek(input.date)) ?? null;

        const staffHoursAll = input.staffId
            ? await this.availabilityRepo.listStaffWorkingHours(input.businessId, input.staffId)
            : [];
        const sh = input.staffId
            ? (staffHoursAll.find((x) => x.dayOfWeek === this.dayOfWeek(input.date)) ?? null)
            : null;

        const from = new Date(input.date + 'T00:00:00.000Z');
        const to = new Date(input.date + 'T23:59:59.999Z');
        const timeOff = await this.timeOffRepo.list({
            businessId: input.businessId,
            staffId: undefined,
            from,
            to,
        });

        const policy = input.staffId ? new StaffPolicy() : new BusinessOnlyPolicy();

        return {
            businessId: input.businessId,
            serviceId: input.serviceId,
            date: input.date,
            staffId: input.staffId,
            durationMin: service.durationMin,
            stepMin: this.slotStepMin,
            slots: policy.buildSlots({
                businessId: input.businessId,
                date: input.date,
                durationMin: service.durationMin,
                slotStepMin: this.slotStepMin,
                staffId: input.staffId,
                businessHours: bh
                    ? { openTime: bh.openTime, closeTime: bh.closeTime, isClosed: bh.isClosed }
                    : null,
                staffHours: sh
                    ? { startTime: sh.startTime, endTime: sh.endTime, isOff: sh.isOff }
                    : null,
                timeOffBlocks: timeOff.map((t) => ({ startAt: t.startAt, endAt: t.endAt, staffId: t.staffId })),
            }),
        };
    }

    private dayOfWeek(yyyyMmDd: string): number {
        const d = new Date(yyyyMmDd + 'T00:00:00.000Z');
        return d.getUTCDay(); // 0-6
    }
}

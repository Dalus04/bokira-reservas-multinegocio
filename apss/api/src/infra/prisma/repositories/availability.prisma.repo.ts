import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { toDomainBusinessHours } from 'src/model/mappers/business-hours.mapper';
import { toDomainStaffWorkingHours } from 'src/model/mappers/staff-working-hours.mapper';
import type {
    AvailabilityRepoPort,
    BusinessHoursInput,
    StaffHoursInput,
} from 'src/model/ports/repositories/availability.repo.port';

@Injectable()
export class AvailabilityPrismaRepo implements AvailabilityRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async listBusinessHours(businessId: string) {
        const rows = await this.prisma.businessHours.findMany({
            where: { businessId },
            orderBy: { dayOfWeek: 'asc' },
        });
        return rows.map((r) => toDomainBusinessHours(r as any));
    }

    async upsertBusinessHours(businessId: string, weekly: BusinessHoursInput[]) {
        // Reemplazo simple: upsert por dayOfWeek (unique)
        await this.prisma.$transaction(
            weekly.map((d) =>
                this.prisma.businessHours.upsert({
                    where: { businessId_dayOfWeek: { businessId, dayOfWeek: d.dayOfWeek } },
                    create: {
                        businessId,
                        dayOfWeek: d.dayOfWeek,
                        openTime: d.openTime,
                        closeTime: d.closeTime,
                        isClosed: d.isClosed,
                    },
                    update: {
                        openTime: d.openTime,
                        closeTime: d.closeTime,
                        isClosed: d.isClosed,
                    },
                }),
            ),
        );

        return this.listBusinessHours(businessId);
    }

    async listStaffWorkingHours(businessId: string, staffId: string) {
        const rows = await this.prisma.staffWorkingHours.findMany({
            where: { businessId, staffId },
            orderBy: { dayOfWeek: 'asc' },
        });
        return rows.map((r) => toDomainStaffWorkingHours(r as any));
    }

    async upsertStaffWorkingHours(businessId: string, staffId: string, weekly: StaffHoursInput[]) {
        await this.prisma.$transaction(
            weekly.map((d) =>
                this.prisma.staffWorkingHours.upsert({
                    where: { businessId_staffId_dayOfWeek: { businessId, staffId, dayOfWeek: d.dayOfWeek } },
                    create: {
                        businessId,
                        staffId,
                        dayOfWeek: d.dayOfWeek,
                        startTime: d.startTime,
                        endTime: d.endTime,
                        isOff: d.isOff,
                    },
                    update: {
                        startTime: d.startTime,
                        endTime: d.endTime,
                        isOff: d.isOff,
                    },
                }),
            ),
        );

        return this.listStaffWorkingHours(businessId, staffId);
    }
}

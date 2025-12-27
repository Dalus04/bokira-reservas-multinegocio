import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { toDomainTimeOff } from 'src/model/mappers/time-off.mapper';
import type { TimeOffRepoPort, ListTimeOffQuery, CreateTimeOffInput, UpdateTimeOffInput } from '../../../model/ports/repositories/time-off.repo.port';

@Injectable()
export class TimeOffPrismaRepo implements TimeOffRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async list(q: ListTimeOffQuery) {
        const rows = await this.prisma.timeOff.findMany({
            where: {
                businessId: q.businessId,
                staffId: q.staffId ?? undefined,
                startAt: q.to ? { lte: q.to } : undefined,
                endAt: q.from ? { gte: q.from } : undefined,
            },
            orderBy: { startAt: 'asc' },
        });
        return rows.map((r) => toDomainTimeOff(r as any));
    }

    async create(input: CreateTimeOffInput) {
        const row = await this.prisma.timeOff.create({
            data: {
                businessId: input.businessId,
                staffId: input.staffId,
                startAt: input.startAt,
                endAt: input.endAt,
                reason: input.reason ?? null,
            },
        });
        return toDomainTimeOff(row as any);
    }

    async findById(businessId: string, timeOffId: string) {
        const row = await this.prisma.timeOff.findFirst({
            where: { id: timeOffId, businessId },
        });
        return row ? toDomainTimeOff(row as any) : null;
    }

    async update(businessId: string, timeOffId: string, data: UpdateTimeOffInput) {
        const row = await this.prisma.timeOff.update({
            where: { id: timeOffId },
            data: {
                startAt: data.startAt,
                endAt: data.endAt,
                reason: data.reason,
            },
        });
        // for safety ensure belongs:
        if (row.businessId !== businessId) throw new Error('TIMEOFF_WRONG_TENANT');
        return toDomainTimeOff(row as any);
    }

    async delete(businessId: string, timeOffId: string) {
        const existing = await this.findById(businessId, timeOffId);
        if (!existing) return;
        await this.prisma.timeOff.delete({ where: { id: timeOffId } });
    }
}

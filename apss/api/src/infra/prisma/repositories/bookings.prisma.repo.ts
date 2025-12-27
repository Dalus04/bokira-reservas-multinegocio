import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { BookingsRepoPort, CreateBookingInput, ListBookingsQuery } from 'src/model/ports/repositories/bookings.repo.port';

@Injectable()
export class BookingsPrismaRepo implements BookingsRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async create(input: CreateBookingInput) {
        return this.prisma.booking.create({
            data: {
                customerId: input.customerId,
                businessId: input.businessId,
                serviceId: input.serviceId,
                staffId: input.staffId,
                startAt: input.startAt,
                endAt: input.endAt,
                notes: input.notes ?? null,
            },
        }) as any;
    }

    async findById(businessId: string, bookingId: string) {
        const row = await this.prisma.booking.findFirst({
            where: { id: bookingId, businessId },
        });
        return (row ?? null) as any;
    }

    async list(q: ListBookingsQuery) {
        const where: any = {
            businessId: q.businessId,
            status: q.status ? q.status : undefined,
            staffId: q.staffId ? q.staffId : undefined,
            startAt: q.to ? { lte: q.to } : undefined,
            endAt: q.from ? { gte: q.from } : undefined,
        };

        const [total, items] = await Promise.all([
            this.prisma.booking.count({ where }),
            this.prisma.booking.findMany({
                where,
                orderBy: { startAt: 'asc' },
                skip: (q.page - 1) * q.limit,
                take: q.limit,
            }),
        ]);

        return { total, items: items as any };
    }

    async hasOverlap(params: {
        businessId: string;
        startAt: Date;
        endAt: Date;
        staffId?: string | null;
        excludeBookingId?: string;
    }) {
        const blockingStatuses = ['PENDING', 'CONFIRMED'];

        const where: any = {
            businessId: params.businessId,
            status: { in: blockingStatuses },
            id: params.excludeBookingId ? { not: params.excludeBookingId } : undefined,
            // overlap condition:
            startAt: { lt: params.endAt },
            endAt: { gt: params.startAt },
        };

        // Si viene staffId => solape en ese staff
        // Si no viene staffId => solape “a nivel negocio”
        if (params.staffId) where.staffId = params.staffId;

        const found = await this.prisma.booking.findFirst({ where, select: { id: true } });
        return !!found;
    }

    async updateStatus(params: {
        businessId: string;
        bookingId: string;
        status: string;
        statusUpdatedById: string;
        ownerConfirmNote?: string | null;
        ownerCancelReason?: string | null;
        ownerRescheduleReason?: string | null;
    }) {
        const row = await this.prisma.booking.update({
            where: { id: params.bookingId },
            data: {
                status: params.status as any,
                statusUpdatedById: params.statusUpdatedById,
                ownerConfirmNote: params.ownerConfirmNote ?? undefined,
                ownerCancelReason: params.ownerCancelReason ?? undefined,
                ownerRescheduleReason: params.ownerRescheduleReason ?? undefined,
            },
        });

        if (row.businessId !== params.businessId) throw new Error('BOOKING_WRONG_TENANT');
        return row as any;
    }

    async updateTimes(params: {
        businessId: string;
        bookingId: string;
        startAt: Date;
        endAt: Date;
        statusUpdatedById: string;
        ownerRescheduleReason?: string | null;
    }) {
        const row = await this.prisma.booking.update({
            where: { id: params.bookingId },
            data: {
                startAt: params.startAt,
                endAt: params.endAt,
                status: 'PENDING',
                statusUpdatedById: params.statusUpdatedById,
                ownerRescheduleReason: params.ownerRescheduleReason ?? null,
            },
        });

        if (row.businessId !== params.businessId) throw new Error('BOOKING_WRONG_TENANT');
        return row as any;
    }
}

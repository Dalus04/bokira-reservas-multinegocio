import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
    NotificationChannel as DbChannel,
    NotificationStatus as DbStatus,
    NotificationType as DbType,
} from 'generated/prisma/enums';

import {
    NotificationChannel,
    NotificationStatus,
    NotificationType,
} from 'src/model/domain/enums/notification';

import type {
    CreateJobInput,
    ListJobsQuery,
    NotificationJobDTO,
    NotificationJobsRepoPort,
} from 'src/model/ports/repositories/notification-jobs.repo.port';

const toDbType = (t: NotificationType): DbType => t as unknown as DbType;
const toDbChannel = (c: NotificationChannel): DbChannel => c as unknown as DbChannel;
const toDbStatus = (s: NotificationStatus): DbStatus => s as unknown as DbStatus;

const fromDbType = (t: DbType): NotificationType => t as unknown as NotificationType;
const fromDbChannel = (c: DbChannel): NotificationChannel => c as unknown as NotificationChannel;
const fromDbStatus = (s: DbStatus): NotificationStatus => s as unknown as NotificationStatus;

@Injectable()
export class NotificationJobsPrismaRepo implements NotificationJobsRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    private map(job: any): NotificationJobDTO {
        return {
            id: job.id,
            type: fromDbType(job.type),
            channel: fromDbChannel(job.channel),
            bookingId: job.bookingId,
            userId: job.userId,
            sendAt: job.sendAt,
            status: fromDbStatus(job.status),
            attempts: job.attempts,
            lastError: job.lastError ?? null,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
        };
    }

    async createManyIgnoreDuplicates(items: CreateJobInput[]) {
        if (items.length === 0) return { attempted: 0 };

        // SQLite Prisma 7: skipDuplicates no tipado => upsert por unique [type, bookingId, channel]
        for (const it of items) {
            await this.prisma.notificationJob.upsert({
                where: {
                    type_bookingId_channel: {
                        type: toDbType(it.type),
                        bookingId: it.bookingId,
                        channel: toDbChannel(it.channel),
                    },
                },
                create: {
                    type: toDbType(it.type),
                    channel: toDbChannel(it.channel),
                    bookingId: it.bookingId,
                    userId: it.userId,
                    sendAt: it.sendAt,
                },
                update: {},
            });
        }

        return { attempted: items.length };
    }

    async list(q: ListJobsQuery) {
        const where: any = {};
        if (q.status) where.status = toDbStatus(q.status);

        const [total, items] = await this.prisma.$transaction([
            this.prisma.notificationJob.count({ where }),
            this.prisma.notificationJob.findMany({
                where,
                orderBy: { sendAt: 'asc' },
                skip: (q.page - 1) * q.limit,
                take: q.limit,
            }),
        ]);

        return { total, items: items.map((x) => this.map(x)) };
    }

    async pickDue(limit: number, now: Date) {
        const items = await this.prisma.notificationJob.findMany({
            where: { status: DbStatus.PENDING, sendAt: { lte: now } },
            orderBy: { sendAt: 'asc' },
            take: limit,
        });
        return items.map((x) => this.map(x));
    }

    async markProcessing(jobId: string) {
        await this.prisma.notificationJob.update({
            where: { id: jobId },
            data: { status: DbStatus.PROCESSING },
        });
    }

    async markSent(jobId: string) {
        await this.prisma.notificationJob.update({
            where: { id: jobId },
            data: { status: DbStatus.SENT },
        });
    }

    async markFailed(jobId: string, error: string) {
        await this.prisma.notificationJob.update({
            where: { id: jobId },
            data: {
                status: DbStatus.FAILED,
                attempts: { increment: 1 },
                lastError: error.slice(0, 500),
            },
        });
    }

    async cancelForBooking(bookingId: string) {
        await this.prisma.notificationJob.updateMany({
            where: {
                bookingId,
                status: { in: [DbStatus.PENDING, DbStatus.PROCESSING] },
            },
            data: { status: DbStatus.CANCELLED },
        });
    }

    async getBookingNotificationContext(bookingId: string) {
        const b = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            select: {
                id: true,
                startAt: true,
                customerId: true,
                business: { select: { id: true, timezone: true, isActive: true, status: true } },
            },
        });

        if (!b) return null;

        return {
            bookingId: b.id,
            startAt: b.startAt,
            customerId: b.customerId,
            business: b.business,
        };
    }
}

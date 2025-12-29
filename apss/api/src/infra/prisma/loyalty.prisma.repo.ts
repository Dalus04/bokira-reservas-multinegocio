import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

import { LoyaltyReason as DbReason } from 'generated/prisma/enums';
import { LoyaltyReason } from 'src/model/domain/enums/loyalty';

import type { LoyaltyRepoPort, LoyaltyAccountDTO, LoyaltyEventDTO } from 'src/model/ports/repositories/loyalty.repo.port';

const toDbReason = (r: LoyaltyReason): DbReason => r as unknown as DbReason;
const fromDbReason = (r: DbReason): LoyaltyReason => r as unknown as LoyaltyReason;

@Injectable()
export class LoyaltyPrismaRepo implements LoyaltyRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    private mapAccount(a: any): LoyaltyAccountDTO {
        return {
            id: a.id,
            businessId: a.businessId,
            customerId: a.customerId,
            points: a.points,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
        };
    }

    private mapEvent(e: any): LoyaltyEventDTO {
        return {
            id: e.id,
            accountId: e.accountId,
            bookingId: e.bookingId ?? null,
            reason: fromDbReason(e.reason),
            pointsDelta: e.pointsDelta,
            note: e.note ?? null,
            createdAt: e.createdAt,
        };
    }

    async getBookingLoyaltyContext(bookingId: string) {
        const b = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            select: {
                id: true,
                businessId: true,
                customerId: true,
                service: { select: { price: true } },
            },
        });

        if (!b) return null;

        // price puede venir como Decimal/ string según config; lo convertimos a string seguro
        const priceAny: any = b.service.price as any;
        const priceStr = typeof priceAny === 'string' ? priceAny : (priceAny?.toString?.() ?? String(priceAny));

        return {
            bookingId: b.id,
            businessId: b.businessId,
            customerId: b.customerId,
            price: priceStr,
        };
    }

    async addEarnFromCompletedBooking(input: { bookingId: string; reason: LoyaltyReason; note?: string | null; pointsDelta: number }) {
        // 1) buscamos booking -> business + customer
        const ctx = await this.getBookingLoyaltyContext(input.bookingId);
        if (!ctx) return { applied: false };

        // 2) garantizamos cuenta
        const account = await this.prisma.loyaltyAccount.upsert({
            where: { businessId_customerId: { businessId: ctx.businessId, customerId: ctx.customerId } },
            create: { businessId: ctx.businessId, customerId: ctx.customerId },
            update: {},
        });

        // 3) idempotencia: gracias a @@unique([bookingId, reason])
        // Si ya existe, no sumamos.
        try {
            const res = await this.prisma.$transaction(async (tx) => {
                await tx.loyaltyEvent.create({
                    data: {
                        accountId: account.id,
                        bookingId: input.bookingId,
                        reason: toDbReason(input.reason),
                        pointsDelta: input.pointsDelta,
                        note: input.note ?? null,
                    },
                });

                const updated = await tx.loyaltyAccount.update({
                    where: { id: account.id },
                    data: { points: { increment: input.pointsDelta } },
                });

                return updated;
            });

            return { applied: true, account: this.mapAccount(res) };
        } catch (err: any) {
            // Prisma unique violation
            const msg = String(err?.message ?? '');
            if (msg.includes('Unique constraint') || msg.includes('P2002')) {
                return { applied: false };
            }
            throw err;
        }
    }

    // web - customer
    async listMyAccounts(userId: string) {
        const items = await this.prisma.loyaltyAccount.findMany({
            where: { customerId: userId },
            orderBy: { updatedAt: 'desc' },
        });
        return items.map((x) => this.mapAccount(x));
    }

    async getMyAccount(input: { userId: string; businessId: string }) {
        const a = await this.prisma.loyaltyAccount.findUnique({
            where: { businessId_customerId: { businessId: input.businessId, customerId: input.userId } },
        });
        return a ? this.mapAccount(a) : null;
    }

    async listMyEvents(input: { userId: string; businessId: string; page: number; limit: number }) {
        const account = await this.prisma.loyaltyAccount.findUnique({
            where: { businessId_customerId: { businessId: input.businessId, customerId: input.userId } },
            select: { id: true },
        });

        if (!account) return { items: [], total: 0 };

        const where = { accountId: account.id };

        const [total, items] = await this.prisma.$transaction([
            this.prisma.loyaltyEvent.count({ where }),
            this.prisma.loyaltyEvent.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (input.page - 1) * input.limit,
                take: input.limit,
            }),
        ]);

        return { total, items: items.map((x) => this.mapEvent(x)) };
    }

    // business - manager
    async listBusinessAccounts(input: { businessId: string; page: number; limit: number; q?: string }) {
        const where: any = { businessId: input.businessId };

        // búsqueda simple por email del customer
        if (input.q) {
            where.customer = { email: { contains: input.q, mode: 'insensitive' } };
        }

        const [total, items] = await this.prisma.$transaction([
            this.prisma.loyaltyAccount.count({ where }),
            this.prisma.loyaltyAccount.findMany({
                where,
                include: { customer: { select: { email: true } } },
                orderBy: { points: 'desc' },
                skip: (input.page - 1) * input.limit,
                take: input.limit,
            }),
        ]);

        return {
            total,
            items: items.map((a) => ({
                ...this.mapAccount(a),
                customerEmail: a.customer?.email ?? null,
            })),
        };
    }
}

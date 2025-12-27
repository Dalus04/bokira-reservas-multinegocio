import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ReviewStatus } from 'src/model/domain/enums/review-status';
import type { ReviewsRepoPort, PublicReviewsQuery, CreateReviewInput, AdminReviewsQuery } from 'src/model/ports/repositories/reviews.repo.port';

@Injectable()
export class ReviewsPrismaRepo implements ReviewsRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async getBookingForReview(bookingId: string) {
        const b = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            select: {
                id: true,
                customerId: true,
                businessId: true,
                serviceId: true,
                status: true,
                review: { select: { id: true } },
            },
        });

        if (!b) return null;

        return {
            id: b.id,
            customerId: b.customerId,
            businessId: b.businessId,
            serviceId: b.serviceId,
            status: b.status,
            reviewId: b.review?.id ?? null,
        };
    }

    async createForBooking(input: CreateReviewInput) {
        // Creamos review con bookingId único (si ya existe -> Prisma P2002)
        // Seteamos serviceId = booking.serviceId (coherente con schema y UI)
        const booking = await this.prisma.booking.findUnique({
            where: { id: input.bookingId },
            select: { businessId: true, serviceId: true, customerId: true },
        });

        if (!booking) return null;

        return this.prisma.review.create({
            data: {
                bookingId: input.bookingId,
                customerId: input.customerId,
                businessId: booking.businessId,
                serviceId: booking.serviceId,
                rating: input.rating,
                comment: input.comment,
                status: ReviewStatus.PUBLISHED,
            },
        });
    }

    async listPublic(q: PublicReviewsQuery) {
        const where = {
            businessId: q.businessId,
            status: ReviewStatus.PUBLISHED,
            ...(q.serviceId ? { serviceId: q.serviceId } : {}),
        };

        const [total, items] = await this.prisma.$transaction([
            this.prisma.review.count({ where }),
            this.prisma.review.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (q.page - 1) * q.limit,
                take: q.limit,
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    customerId: true,
                    serviceId: true,
                },
            }),
        ]);

        return { total, items };
    }

    async adminList(q: AdminReviewsQuery) {
        const where = {
            ...(q.businessId ? { businessId: q.businessId } : {}),
            ...(q.status ? { status: q.status } : {}),
        };

        const [total, items] = await this.prisma.$transaction([
            this.prisma.review.count({ where }),
            this.prisma.review.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (q.page - 1) * q.limit,
                take: q.limit,
                select: {
                    id: true,
                    businessId: true,
                    bookingId: true,
                    customerId: true,
                    serviceId: true,
                    rating: true,
                    comment: true,
                    status: true,
                    createdAt: true,
                },
            }),
        ]);

        return { total, items };
    }

    adminSetStatus(input: { reviewId: string; status: ReviewStatus }) {
        return this.prisma.review.update({
            where: { id: input.reviewId },
            data: { status: input.status },
        });
    }
}

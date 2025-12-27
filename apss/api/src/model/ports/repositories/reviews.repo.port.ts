import { ReviewStatus } from 'src/model/domain/enums/review-status';

export const REVIEWS_REPO = Symbol('REVIEWS_REPO');

export type PublicReviewsQuery = {
    businessId: string;
    serviceId?: string;
    page: number;
    limit: number;
};

export type CreateReviewInput = {
    bookingId: string;
    customerId: string;
    rating: number;
    comment?: string;
};

export type AdminReviewsQuery = {
    businessId?: string;
    status?: ReviewStatus;
    page: number;
    limit: number;
};

export interface ReviewsRepoPort {
    listPublic(q: PublicReviewsQuery): Promise<{ items: any[]; total: number }>;
    createForBooking(input: CreateReviewInput): Promise<any>;

    adminList(q: AdminReviewsQuery): Promise<{ items: any[]; total: number }>;
    adminSetStatus(input: { reviewId: string; status: ReviewStatus }): Promise<any>;

    // helpers internos para reglas
    getBookingForReview(bookingId: string): Promise<{
        id: string;
        customerId: string;
        businessId: string;
        serviceId: string;
        status: string;
        reviewId?: string | null;
    } | null>;
}

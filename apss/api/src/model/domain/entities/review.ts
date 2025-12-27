import { ReviewStatus } from '../enums/review-status';

export type Review = {
    id: string;
    customerId: string;
    businessId: string;
    bookingId: string;
    serviceId?: string | null;

    rating: number;
    comment?: string | null;
    status: ReviewStatus;

    createdAt: Date;
    updatedAt: Date;
};

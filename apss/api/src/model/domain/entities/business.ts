import { BusinessStatus } from '../enums/business-status';

export type Business = {
    id: string;
    ownerId: string;
    platformCategoryId: string;
    status: BusinessStatus;

    reviewedByAdminId: string | null;
    approvedAt: Date | null;
    rejectedReason: string | null;

    name: string;
    slug: string;
    description: string | null;
    address: string | null;
    city: string | null;
    phone: string | null;
    imageUrl: string | null;

    timezone: string;
    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
};

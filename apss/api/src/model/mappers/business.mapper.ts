import type { Business } from '../domain/entities/business';
import { BusinessStatus } from '../domain/enums/business-status';

type DbBusinessLike = {
    id: string;
    ownerId: string;
    platformCategoryId: string;
    status: string;

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

export function toDomainBusiness(row: DbBusinessLike): Business {
    return {
        id: row.id,
        ownerId: row.ownerId,
        platformCategoryId: row.platformCategoryId,
        status: row.status as BusinessStatus,

        reviewedByAdminId: row.reviewedByAdminId,
        approvedAt: row.approvedAt,
        rejectedReason: row.rejectedReason,

        name: row.name,
        slug: row.slug,
        description: row.description,
        address: row.address,
        city: row.city,
        phone: row.phone,
        imageUrl: row.imageUrl,

        timezone: row.timezone,
        isActive: row.isActive,

        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

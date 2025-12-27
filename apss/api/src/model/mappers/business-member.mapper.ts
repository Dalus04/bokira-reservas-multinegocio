import type { BusinessMember } from '../domain/entities/business-member';

type DbBusinessMemberLike = {
    id: string;
    businessId: string;
    userId: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
};

export function toDomainBusinessMember(row: DbBusinessMemberLike): BusinessMember {
    return {
        id: row.id,
        businessId: row.businessId,
        userId: row.userId,
        role: row.role as any,
        isActive: row.isActive,
        createdAt: row.createdAt,
    };
}

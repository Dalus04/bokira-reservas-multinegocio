import type { Business } from 'src/model/domain/entities/business';
import type { BusinessStatus } from 'src/model/domain/enums/business-status';

export const BUSINESSES_REPO = Symbol('BUSINESSES_REPO');

export type Paginated<T> = {
    items: T[];
    page: number;
    limit: number;
    total: number;
};

export type PublicListBusinessesQuery = {
    q?: string;
    categorySlug?: string;
    city?: string;
    page: number;
    limit: number;
};

export type AdminListBusinessesQuery = {
    status?: BusinessStatus;
    page: number;
    limit: number;
};

export type CreateBusinessInput = {
    ownerId: string;
    platformCategoryId: string;
    name: string;
    slug: string;
    description?: string | null;
    address?: string | null;
    city?: string | null;
    phone?: string | null;
    imageUrl?: string | null;
    timezone?: string;
};

export type UpdateBusinessInput = {
    name?: string;
    description?: string | null;
    address?: string | null;
    city?: string | null;
    phone?: string | null;
    imageUrl?: string | null;
    platformCategoryId?: string;
    isActive?: boolean;
    timezone?: string;
};

export interface BusinessesRepoPort {
    // public
    publicList(query: PublicListBusinessesQuery): Promise<Paginated<Pick<Business, 'id' | 'name' | 'slug' | 'city' | 'imageUrl' | 'platformCategoryId'>>>;
    publicGetBySlug(slug: string): Promise<Business | null>;

    // private
    create(input: CreateBusinessInput): Promise<Business>;
    listMy(userId: string, page: number, limit: number): Promise<Paginated<Business>>;
    getById(businessId: string): Promise<Business | null>;
    update(businessId: string, data: UpdateBusinessInput): Promise<Business>;

    // workflow
    submitForReview(businessId: string): Promise<Business>;
    adminList(query: AdminListBusinessesQuery): Promise<Paginated<Business>>;
    adminApprove(businessId: string, adminId: string): Promise<Business>;
    adminReject(businessId: string, adminId: string, reason: string): Promise<Business>;
    adminSuspend(businessId: string, adminId: string, reason?: string | null): Promise<Business>;
}

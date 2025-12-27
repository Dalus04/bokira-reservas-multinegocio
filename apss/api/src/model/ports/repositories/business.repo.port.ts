export const BUSINESS_REPO = Symbol('BUSINESS_REPO');

export type BusinessTenant = {
    id: string;      
    slug: string;
    ownerId: string;
    isActive: boolean;
    status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
};


export type BusinessMembership = {
    userId: string;
    role: 'STAFF' | 'MANAGER';
    isActive: boolean;
};

export interface BusinessRepoPort {
    findById(businessId: string): Promise<BusinessTenant | null>;
    findBySlug(slug: string): Promise<BusinessTenant | null>;
    findMembership(businessId: string, userId: string): Promise<BusinessMembership | null>;
}

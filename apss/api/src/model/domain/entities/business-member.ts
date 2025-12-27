export type BusinessMember = {
    id: string;
    businessId: string;
    userId: string;
    role: 'STAFF' | 'MANAGER';
    isActive: boolean;
    createdAt: Date;
};

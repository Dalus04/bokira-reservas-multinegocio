export type Service = {
    id: string;
    businessId: string;
    serviceCategoryId: string | null;

    name: string;
    description: string | null;
    price: string;        // Decimal como string en API
    durationMin: number;
    imageUrl: string | null;

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    deletedAt?: Date | null; 
};

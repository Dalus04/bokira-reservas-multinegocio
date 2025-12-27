export const SERVICE_CATEGORIES_REPO = Symbol('SERVICE_CATEGORIES_REPO');

export type CreateServiceCategoryInput = {
    businessId: string;
    name: string;
};

export type UpdateServiceCategoryInput = {
    businessId: string;
    categoryId: string;
    name: string;
};

export type ListServiceCategoriesQuery = {
    businessId: string;
};

export interface ServiceCategoriesRepoPort {
    create(input: CreateServiceCategoryInput): Promise<any>;
    update(input: UpdateServiceCategoryInput): Promise<any>;
    list(q: ListServiceCategoriesQuery): Promise<any[]>;
    findById(businessId: string, categoryId: string): Promise<any | null>;
    existsByName(businessId: string, name: string): Promise<boolean>;
}

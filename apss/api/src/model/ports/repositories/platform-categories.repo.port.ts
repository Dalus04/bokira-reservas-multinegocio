import type { PlatformCategory } from 'src/model/domain/entities/platform-category';

export const PLATFORM_CATEGORIES_REPO = Symbol('PLATFORM_CATEGORIES_REPO');

export type ListPlatformCategoriesQuery = {
    q?: string;
    page: number;
    limit: number;
};

export type Paginated<T> = {
    items: T[];
    page: number;
    limit: number;
    total: number;
};

export interface PlatformCategoriesRepoPort {
    list(query: ListPlatformCategoriesQuery): Promise<Paginated<PlatformCategory>>;
    getBySlug(slug: string): Promise<PlatformCategory | null>;
}

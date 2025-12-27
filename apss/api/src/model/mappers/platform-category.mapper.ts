import type { PlatformCategory } from '../domain/entities/platform-category';

type DbPlatformCategoryLike = {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
};

export function toDomainPlatformCategory(db: DbPlatformCategoryLike): PlatformCategory {
    return {
        id: db.id,
        name: db.name,
        slug: db.slug,
        createdAt: db.createdAt,
    };
}

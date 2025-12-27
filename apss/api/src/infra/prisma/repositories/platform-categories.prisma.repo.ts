import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import type {
    PlatformCategoriesRepoPort,
    ListPlatformCategoriesQuery,
    Paginated,
} from 'src/model/ports/repositories/platform-categories.repo.port';
import type { PlatformCategory } from 'src/model/domain/entities/platform-category';
import { toDomainPlatformCategory } from 'src/model/mappers/platform-category.mapper';

@Injectable()
export class PlatformCategoriesPrismaRepo implements PlatformCategoriesRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async list(query: ListPlatformCategoriesQuery): Promise<Paginated<PlatformCategory>> {
        const { q, page, limit } = query;
        const skip = (page - 1) * limit;

        const where = q
            ? {
                OR: [
                    { name: { contains: q } },
                    { slug: { contains: q } },
                ],
            }
            : {};

        const [total, rows] = await Promise.all([
            this.prisma.platformCategory.count({ where }),
            this.prisma.platformCategory.findMany({
                where,
                orderBy: { name: 'asc' },
                skip,
                take: limit,
                select: { id: true, name: true, slug: true, createdAt: true },
            }),
        ]);

        return {
            items: rows.map((r) => toDomainPlatformCategory(r)),
            page,
            limit,
            total,
        };
    }

    async getBySlug(slug: string): Promise<PlatformCategory | null> {
        const row = await this.prisma.platformCategory.findUnique({
            where: { slug },
            select: { id: true, name: true, slug: true, createdAt: true },
        });
        return row ? toDomainPlatformCategory(row) : null;
    }
}

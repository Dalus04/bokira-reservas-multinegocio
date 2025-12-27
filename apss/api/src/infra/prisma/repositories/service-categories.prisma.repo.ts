import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type {
    ServiceCategoriesRepoPort,
    CreateServiceCategoryInput,
    UpdateServiceCategoryInput,
    ListServiceCategoriesQuery,
} from 'src/model/ports/repositories/service-categories.repo.port';

@Injectable()
export class ServiceCategoriesPrismaRepo implements ServiceCategoriesRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    create(input: CreateServiceCategoryInput) {
        return this.prisma.serviceCategory.create({
            data: {
                businessId: input.businessId,
                name: input.name,
            },
        });
    }

    update(input: UpdateServiceCategoryInput) {
        return this.prisma.serviceCategory.update({
            where: { id: input.categoryId },
            data: { name: input.name },
        });
    }

    list(q: ListServiceCategoriesQuery) {
        return this.prisma.serviceCategory.findMany({
            where: { businessId: q.businessId },
            orderBy: { createdAt: 'asc' },
        });
    }

    findById(businessId: string, categoryId: string) {
        return this.prisma.serviceCategory.findFirst({
            where: { id: categoryId, businessId },
        });
    }

    async existsByName(businessId: string, name: string) {
        const count = await this.prisma.serviceCategory.count({
            where: { businessId, name },
        });
        return count > 0;
    }
}

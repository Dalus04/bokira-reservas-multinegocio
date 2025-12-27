import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { ServicesRepoPort, CreateServiceInput, UpdateServiceInput, ListServicesQuery, ListPublicServicesQuery } from 'src/model/ports/repositories/services.repo.port';

@Injectable()
export class ServicesPrismaRepo implements ServicesRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async findForAvailability(serviceId: string) {
        return this.prisma.service.findUnique({
            where: { id: serviceId },
            select: { id: true, businessId: true, durationMin: true, isActive: true },
        });
    }

    async create(input: CreateServiceInput) {
        return this.prisma.service.create({
            data: {
                businessId: input.businessId,
                serviceCategoryId: input.serviceCategoryId ?? null,
                name: input.name,
                description: input.description ?? null,
                price: input.price as any,
                durationMin: input.durationMin,
                imageUrl: input.imageUrl ?? null,
                isActive: true,
            },
        });
    }

    async update(input: UpdateServiceInput) {
        const row = await this.prisma.service.update({
            where: { id: input.serviceId },
            data: {
                serviceCategoryId: input.serviceCategoryId ?? undefined,
                name: input.name ?? undefined,
                description: input.description ?? undefined,
                price: (input.price as any) ?? undefined,
                durationMin: input.durationMin ?? undefined,
                imageUrl: input.imageUrl ?? undefined,
                isActive: input.isActive ?? undefined,
            },
        });
        if (row.businessId !== input.businessId) throw new Error('SERVICE_WRONG_TENANT');
        return row;
    }

    async archive(businessId: string, serviceId: string) {
        const row = await this.prisma.service.update({
            where: { id: serviceId },
            data: {
                isActive: false,
                // si agregaste deletedAt:
                deletedAt: new Date(),
            } as any,
        });
        if (row.businessId !== businessId) throw new Error('SERVICE_WRONG_TENANT');
        return row;
    }

    async findById(businessId: string, serviceId: string) {
        const row = await this.prisma.service.findFirst({ where: { id: serviceId, businessId } });
        return row ?? null;
    }

    async list(q: ListServicesQuery) {
        const where: any = {
            businessId: q.businessId,
            ...(q.categoryId ? { serviceCategoryId: q.categoryId } : {}),
            ...(q.isActive !== undefined ? { isActive: q.isActive } : {}),
            ...(q.q ? { name: { contains: q.q, mode: 'insensitive' } } : {}),
            // si tienes deletedAt:
            deletedAt: null,
        };

        const [total, items] = await Promise.all([
            this.prisma.service.count({ where }),
            this.prisma.service.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (q.page - 1) * q.limit,
                take: q.limit,
            }),
        ]);

        return { total, items };
    }

    async publicFindById(businessId: string, serviceId: string) {
        return this.prisma.service.findFirst({
            where: {
                id: serviceId,
                businessId,
                isActive: true,
                deletedAt: null,
            } as any,
        });
    }

    async publicList(q: ListPublicServicesQuery) {
        const where: any = {
            businessId: q.businessId,
            isActive: true,
            deletedAt: null,
            ...(q.categoryId ? { serviceCategoryId: q.categoryId } : {}),
            ...(q.q ? { name: { contains: q.q, mode: 'insensitive' } } : {}),
        };

        const [total, items] = await Promise.all([
            this.prisma.service.count({ where }),
            this.prisma.service.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (q.page - 1) * q.limit,
                take: q.limit,
            }),
        ]);

        return { total, items };
    }
}

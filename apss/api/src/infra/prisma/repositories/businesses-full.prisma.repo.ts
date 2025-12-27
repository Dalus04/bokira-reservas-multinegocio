import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { toDomainBusiness } from 'src/model/mappers/business.mapper';
import type {
    BusinessesRepoPort,
    PublicListBusinessesQuery,
    AdminListBusinessesQuery,
    Paginated,
    CreateBusinessInput,
    UpdateBusinessInput,
} from 'src/model/ports/repositories/businesses.repo.port';
import type { Business } from 'src/model/domain/entities/business';
import { BusinessStatus } from 'src/model/domain/enums/business-status';

@Injectable()
export class BusinessesFullPrismaRepo implements BusinessesRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async publicList(query: PublicListBusinessesQuery): Promise<Paginated<Pick<Business, 'id' | 'name' | 'slug' | 'city' | 'imageUrl' | 'platformCategoryId'>>> {
        const { q, city, categorySlug, page, limit } = query;
        const skip = (page - 1) * limit;

        // filtrar por categorySlug requiere join: primero buscar categoryId
        const categoryId = categorySlug
            ? (await this.prisma.platformCategory.findUnique({ where: { slug: categorySlug }, select: { id: true } }))?.id
            : undefined;

        const where: any = {
            isActive: true,
            status: 'APPROVED',
        };

        if (q) {
            where.OR = [
                { name: { contains: q } },
                { slug: { contains: q } },
            ];
        }
        if (city) where.city = { contains: city };
        if (categoryId) where.platformCategoryId = categoryId;

        const [total, rows] = await Promise.all([
            this.prisma.business.count({ where }),
            this.prisma.business.findMany({
                where,
                orderBy: { name: 'asc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    city: true,
                    imageUrl: true,
                    platformCategoryId: true,
                },
            }),
        ]);

        return { items: rows as any, page, limit, total };
    }

    async publicGetBySlug(slug: string): Promise<Business | null> {
        const row = await this.prisma.business.findUnique({
            where: { slug },
            select: {
                id: true, ownerId: true, platformCategoryId: true, status: true,
                reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                timezone: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });
        return row ? toDomainBusiness(row as any) : null;
    }

    async create(input: CreateBusinessInput): Promise<Business> {
        const row = await this.prisma.business.create({
            data: {
                ownerId: input.ownerId,
                platformCategoryId: input.platformCategoryId,
                status: 'DRAFT',
                name: input.name,
                slug: input.slug,
                description: input.description ?? null,
                address: input.address ?? null,
                city: input.city ?? null,
                phone: input.phone ?? null,
                imageUrl: input.imageUrl ?? null,
                timezone: input.timezone ?? 'America/Lima',
                isActive: true,
            },
            select: {
                id: true, ownerId: true, platformCategoryId: true, status: true,
                reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                timezone: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });

        return toDomainBusiness(row as any);
    }

    async listMy(userId: string, page: number, limit: number): Promise<Paginated<Business>> {
        const skip = (page - 1) * limit;

        // owner OR membership
        const where: any = {
            OR: [
                { ownerId: userId },
                { members: { some: { userId, isActive: true } } },
            ],
        };

        const [total, rows] = await Promise.all([
            this.prisma.business.count({ where }),
            this.prisma.business.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true, ownerId: true, platformCategoryId: true, status: true,
                    reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                    name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                    timezone: true, isActive: true,
                    createdAt: true, updatedAt: true,
                },
            }),
        ]);

        return { items: rows.map((r) => toDomainBusiness(r as any)), page, limit, total };
    }

    async getById(businessId: string): Promise<Business | null> {
        const row = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: {
                id: true, ownerId: true, platformCategoryId: true, status: true,
                reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                timezone: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });
        return row ? toDomainBusiness(row as any) : null;
    }

    async update(businessId: string, data: UpdateBusinessInput): Promise<Business> {
        const row = await this.prisma.business.update({
            where: { id: businessId },
            data: {
                name: data.name,
                description: data.description,
                address: data.address,
                city: data.city,
                phone: data.phone,
                imageUrl: data.imageUrl,
                platformCategoryId: data.platformCategoryId,
                timezone: data.timezone,
                isActive: data.isActive,
            },
            select: {
                id: true, ownerId: true, platformCategoryId: true, status: true,
                reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                timezone: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });

        return toDomainBusiness(row as any);
    }

    async submitForReview(businessId: string): Promise<Business> {
        const row = await this.prisma.business.update({
            where: { id: businessId },
            data: { status: 'PENDING_REVIEW' },
            select: {
                id: true, ownerId: true, platformCategoryId: true, status: true,
                reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                timezone: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });
        return toDomainBusiness(row as any);
    }

    async adminList(query: AdminListBusinessesQuery): Promise<Paginated<Business>> {
        const { status, page, limit } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) where.status = status;

        const [total, rows] = await Promise.all([
            this.prisma.business.count({ where }),
            this.prisma.business.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true, ownerId: true, platformCategoryId: true, status: true,
                    reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                    name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                    timezone: true, isActive: true,
                    createdAt: true, updatedAt: true,
                },
            }),
        ]);

        return { items: rows.map((r) => toDomainBusiness(r as any)), page, limit, total };
    }

    async adminApprove(businessId: string, adminId: string): Promise<Business> {
        const row = await this.prisma.business.update({
            where: { id: businessId },
            data: {
                status: 'APPROVED',
                reviewedByAdminId: adminId,
                approvedAt: new Date(),
                rejectedReason: null,
            },
            select: {
                id: true, ownerId: true, platformCategoryId: true, status: true,
                reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                timezone: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });
        return toDomainBusiness(row as any);
    }

    async adminReject(businessId: string, adminId: string, reason: string): Promise<Business> {
        const row = await this.prisma.business.update({
            where: { id: businessId },
            data: {
                status: 'REJECTED',
                reviewedByAdminId: adminId,
                rejectedReason: reason,
                approvedAt: null,
            },
            select: {
                id: true, ownerId: true, platformCategoryId: true, status: true,
                reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                timezone: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });
        return toDomainBusiness(row as any);
    }

    async adminSuspend(businessId: string, adminId: string, reason?: string | null): Promise<Business> {
        const row = await this.prisma.business.update({
            where: { id: businessId },
            data: {
                status: 'SUSPENDED',
                reviewedByAdminId: adminId,
                rejectedReason: reason ?? null,
            },
            select: {
                id: true, ownerId: true, platformCategoryId: true, status: true,
                reviewedByAdminId: true, approvedAt: true, rejectedReason: true,
                name: true, slug: true, description: true, address: true, city: true, phone: true, imageUrl: true,
                timezone: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });
        return toDomainBusiness(row as any);
    }
}

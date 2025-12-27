import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type {
    BusinessRepoPort,
    BusinessTenant,
    BusinessMembership,
} from 'src/model/ports/repositories/business.repo.port';

@Injectable()
export class BusinessesPrismaRepo implements BusinessRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async findById(businessId: string): Promise<BusinessTenant | null> {
        return this.prisma.business.findUnique({
            where: { id: businessId },
            select: {
                id: true,
                slug: true,
                ownerId: true,
                isActive: true,
                status: true,
            },
        }) as any;
    }

    async findBySlug(slug: string): Promise<BusinessTenant | null> {
        return this.prisma.business.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                ownerId: true,
                isActive: true,
                status: true,
            },
        }) as any;
    }

    async findMembership(
        businessId: string,
        userId: string,
    ): Promise<BusinessMembership | null> {
        return this.prisma.businessMember.findUnique({
            where: { businessId_userId: { businessId, userId } },
            select: {
                userId: true,
                role: true,
                isActive: true,
            },
        }) as any;
    }
}

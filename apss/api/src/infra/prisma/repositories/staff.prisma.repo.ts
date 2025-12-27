import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { toDomainBusinessMember } from 'src/model/mappers/business-member.mapper';
import type {
    StaffRepoPort,
    Paginated,
    StaffMemberView,
    AddStaffMemberInput,
    UpdateStaffMemberInput,
} from 'src/model/ports/repositories/staff.repo.port';

@Injectable()
export class StaffPrismaRepo implements StaffRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async findUserIdByEmail(email: string): Promise<string | null> {
        const u = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return u?.id ?? null;
    }

    async existsMembership(businessId: string, userId: string): Promise<boolean> {
        const m = await this.prisma.businessMember.findUnique({
            where: { businessId_userId: { businessId, userId } },
            select: { id: true },
        });
        return !!m;
    }

    private async mapMemberView(memberId: string): Promise<StaffMemberView> {
        const row = await this.prisma.businessMember.findUniqueOrThrow({
            where: { id: memberId },
            select: {
                id: true,
                businessId: true,
                userId: true,
                role: true,
                isActive: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        isActive: true,
                    },
                },
            },
        });

        return {
            ...toDomainBusinessMember(row as any),
            user: row.user as any,
        };
    }

    async list(businessId: string, page: number, limit: number): Promise<Paginated<StaffMemberView>> {
        const skip = (page - 1) * limit;

        const where = { businessId };

        const [total, rows] = await Promise.all([
            this.prisma.businessMember.count({ where }),
            this.prisma.businessMember.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    businessId: true,
                    userId: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            phone: true,
                            isActive: true,
                        },
                    },
                },
            }),
        ]);

        return {
            items: rows.map((r) => ({
                ...toDomainBusinessMember(r as any),
                user: r.user as any,
            })),
            page,
            limit,
            total,
        };
    }

    async add(input: AddStaffMemberInput): Promise<StaffMemberView> {
        const userId = await this.findUserIdByEmail(input.email);
        if (!userId) {
            // lanzamos error en usecase para mantener filtros coherentes
            // aquí devolvemos null, pero el usecase lo controla
            throw new Error('USER_NOT_FOUND');
        }

        const member = await this.prisma.businessMember.create({
            data: {
                businessId: input.businessId,
                userId,
                role: input.role,
                isActive: true,
            },
            select: { id: true },
        });

        return this.mapMemberView(member.id);
    }

    async findMemberById(businessId: string, memberId: string): Promise<StaffMemberView | null> {
        const row = await this.prisma.businessMember.findFirst({
            where: { id: memberId, businessId },
            select: {
                id: true,
                businessId: true,
                userId: true,
                role: true,
                isActive: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        isActive: true,
                    },
                },
            },
        });

        if (!row) return null;

        return {
            ...toDomainBusinessMember(row as any),
            user: row.user as any,
        };
    }

    async update(
        businessId: string,
        memberId: string,
        data: UpdateStaffMemberInput,
    ): Promise<StaffMemberView> {
        // aseguramos que pertenece al business
        const existing = await this.findMemberById(businessId, memberId);
        if (!existing) throw new Error('MEMBER_NOT_FOUND');

        const updated = await this.prisma.businessMember.update({
            where: { id: memberId },
            data: {
                role: data.role,
                isActive: data.isActive,
            },
            select: { id: true },
        });

        return this.mapMemberView(updated.id);
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GlobalRole as PrismaGlobalRole } from 'src/model/domain/enums/global-role';

import type { UsersRepoPort } from 'src/model/ports/repositories/users.repo.port';
import type { CreateUserInput } from 'src/model/domain/entities/user';
import { toDomainUserSafe, toDomainUserWithPassword } from 'src/model/mappers/user.mapper';

@Injectable()
export class UsersPrismaRepo implements UsersRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                globalRole: true,
                isActive: true,
                createdAt: true,
                passwordHash: true,
            },
        });

        if (!user) return null;
        return toDomainUserWithPassword(user as any);
    }

    async findSafeById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                globalRole: true,
                isActive: true,
                createdAt: true,
            },
        });

        if (!user) return null;
        return toDomainUserSafe(user as any);
    }

    async create(input: CreateUserInput) {
        const user = await this.prisma.user.create({
            data: {
                email: input.email,
                passwordHash: input.passwordHash,
                name: input.name,
                phone: input.phone ?? null,

                // ✅ Mapeo DOMINIO -> PRISMA
                globalRole: (input.globalRole ?? 'USER') as PrismaGlobalRole,

                isActive: input.isActive ?? true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                globalRole: true,
                isActive: true,
                createdAt: true,
            },
        });

        return toDomainUserSafe(user as any);
    }
}

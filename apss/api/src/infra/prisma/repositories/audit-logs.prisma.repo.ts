import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import type {
    AuditLogDTO,
    AuditLogsRepoPort,
    CreateAuditLogInput,
    ListAuditLogsQuery,
} from 'src/model/ports/repositories/audit-logs.repo.port';

import {
    AuditAction,
    AuditEntityType,
} from 'src/model/domain/enums/audit';

import {
    AuditAction as DbAuditAction,
    AuditEntityType as DbAuditEntityType,
} from 'generated/prisma/enums';

const toDbEntityType = (t: AuditEntityType): DbAuditEntityType => t as unknown as DbAuditEntityType;
const toDbAction = (a: AuditAction): DbAuditAction => a as unknown as DbAuditAction;

const fromDbEntityType = (t: DbAuditEntityType): AuditEntityType => t as unknown as AuditEntityType;
const fromDbAction = (a: DbAuditAction): AuditAction => a as unknown as AuditAction;

@Injectable()
export class AuditLogsPrismaRepo implements AuditLogsRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    private map(row: any): AuditLogDTO {
        return {
            id: row.id,
            actorUserId: row.actorUserId,
            businessId: row.businessId ?? null,
            entityType: fromDbEntityType(row.entityType),
            entityId: row.entityId,
            action: fromDbAction(row.action),
            metadataJson: row.metadataJson ?? null,
            ip: row.ip ?? null,
            userAgent: row.userAgent ?? null,
            createdAt: row.createdAt,
        };
    }

    async create(input: CreateAuditLogInput): Promise<AuditLogDTO> {
        const metadataJson =
            input.metadata === undefined ? null : JSON.stringify(input.metadata);

        const row = await this.prisma.auditLog.create({
            data: {
                actorUserId: input.actorUserId,
                businessId: input.businessId ?? null,
                entityType: toDbEntityType(input.entityType),
                entityId: input.entityId,
                action: toDbAction(input.action),
                metadataJson,
                ip: input.ip ?? null,
                userAgent: input.userAgent ?? null,
            },
        });

        return this.map(row);
    }

    async list(q: ListAuditLogsQuery) {
        const where: any = {
            businessId: q.businessId ? q.businessId : undefined,
            actorUserId: q.actorUserId ? q.actorUserId : undefined,
            entityType: q.entityType ? toDbEntityType(q.entityType) : undefined,
            entityId: q.entityId ? q.entityId : undefined,
            action: q.action ? toDbAction(q.action) : undefined,
            createdAt: {
                gte: q.from ?? undefined,
                lte: q.to ?? undefined,
            },
        };

        // limpia createdAt si no hay filtros
        if (!q.from && !q.to) delete where.createdAt;

        const [total, items] = await this.prisma.$transaction([
            this.prisma.auditLog.count({ where }),
            this.prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (q.page - 1) * q.limit,
                take: q.limit,
            }),
        ]);

        return { total, items: items.map((x) => this.map(x)) };
    }
}

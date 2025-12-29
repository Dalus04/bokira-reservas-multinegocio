import { AuditAction, AuditEntityType } from 'src/model/domain/enums/audit';

export const AUDIT_LOGS_REPO = Symbol('AUDIT_LOGS_REPO');

export type CreateAuditLogInput = {
    actorUserId: string;
    businessId?: string | null;

    entityType: AuditEntityType;
    entityId: string;
    action: AuditAction;

    metadata?: unknown; // se serializa a JSON string
    ip?: string | null;
    userAgent?: string | null;
};

export type ListAuditLogsQuery = {
    businessId?: string;
    actorUserId?: string;
    entityType?: AuditEntityType;
    entityId?: string;
    action?: AuditAction;
    from?: Date;
    to?: Date;
    page: number;
    limit: number;
};

export type AuditLogDTO = {
    id: string;

    actorUserId: string;
    businessId: string | null;

    entityType: AuditEntityType;
    entityId: string;
    action: AuditAction;

    metadataJson: string | null;
    ip: string | null;
    userAgent: string | null;

    createdAt: Date;
};

export interface AuditLogsRepoPort {
    create(input: CreateAuditLogInput): Promise<AuditLogDTO>;
    list(q: ListAuditLogsQuery): Promise<{ items: AuditLogDTO[]; total: number }>;
}

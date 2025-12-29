import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGS_REPO, type AuditLogsRepoPort } from 'src/model/ports/repositories/audit-logs.repo.port';
import { AuditAction, AuditEntityType } from 'src/model/domain/enums/audit';

@Injectable()
export class ListAuditLogsAdminUseCase {
  constructor(@Inject(AUDIT_LOGS_REPO) private readonly repo: AuditLogsRepoPort) {}

  exec(input: {
    businessId?: string;
    actorUserId?: string;
    entityType?: AuditEntityType;
    entityId?: string;
    action?: AuditAction;
    from?: Date;
    to?: Date;
    page: number;
    limit: number;
  }) {
    return this.repo.list({
      businessId: input.businessId,
      actorUserId: input.actorUserId,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      from: input.from,
      to: input.to,
      page: input.page,
      limit: input.limit,
    });
  }
}

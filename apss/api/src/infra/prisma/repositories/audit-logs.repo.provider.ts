import { AUDIT_LOGS_REPO } from 'src/model/ports/repositories/audit-logs.repo.port';
import { AuditLogsPrismaRepo } from './audit-logs.prisma.repo';

export const auditLogsRepoProvider = {
    provide: AUDIT_LOGS_REPO,
    useClass: AuditLogsPrismaRepo,
};

import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGS_REPO, type AuditLogsRepoPort, type CreateAuditLogInput } from 'src/model/ports/repositories/audit-logs.repo.port';

@Injectable()
export class WriteAuditLogUseCase {
    constructor(@Inject(AUDIT_LOGS_REPO) private readonly repo: AuditLogsRepoPort) { }

    exec(input: CreateAuditLogInput) {
        return this.repo.create(input);
    }
}

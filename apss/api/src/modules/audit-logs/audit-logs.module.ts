import { Module } from '@nestjs/common';

import { AuditLogsAdminController } from './audit-logs.admin.controller';

import { AuditLogsPrismaRepo } from 'src/infra/prisma/repositories/audit-logs.prisma.repo';
import { auditLogsRepoProvider } from 'src/infra/prisma/repositories/audit-logs.repo.provider';

import { WriteAuditLogUseCase } from './use-cases/write-audit-log.usecase';
import { ListAuditLogsAdminUseCase } from './use-cases/list-audit-logs-admin.usecase';

import { BookingAuditSubscriber } from './subscribers/booking-audit.subscriber';

@Module({
    controllers: [AuditLogsAdminController],
    providers: [
        // repo prisma
        AuditLogsPrismaRepo,
        auditLogsRepoProvider,

        // use-cases
        WriteAuditLogUseCase,
        ListAuditLogsAdminUseCase,

        // subscribers
        BookingAuditSubscriber,
    ],
})
export class AuditLogsModule { }

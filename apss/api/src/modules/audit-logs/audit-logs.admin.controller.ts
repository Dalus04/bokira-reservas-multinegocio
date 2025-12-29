import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GlobalRole } from 'src/model/domain/enums/global-role';

import { ListAuditLogsAdminDto } from './dtos/list-audit-logs-admin.dto';
import { ListAuditLogsAdminUseCase } from './use-cases/list-audit-logs-admin.usecase';

@ApiTags('admin/audit-logs')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(GlobalRole.ADMIN)
@Controller('admin/audit-logs')
export class AuditLogsAdminController {
    constructor(private readonly listUC: ListAuditLogsAdminUseCase) { }

    @Get()
    @ApiOperation({ summary: 'List audit logs (admin)' })
    list(@Query() q: ListAuditLogsAdminDto) {
        return this.listUC.exec({
            businessId: q.businessId,
            actorUserId: q.actorUserId,
            entityType: q.entityType,
            entityId: q.entityId,
            action: q.action,
            from: q.from ? new Date(q.from) : undefined,
            to: q.to ? new Date(q.to) : undefined,
            page: q.page,
            limit: q.limit,
        });
    }
}

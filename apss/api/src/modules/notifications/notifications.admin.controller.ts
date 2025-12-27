import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GlobalRole } from 'src/model/domain/enums/global-role';

import { ListNotificationJobsDto } from './dtos/list-notification-jobs.dto';
import { RunDueNotificationsDto } from './dtos/run-due-notifications.dto';

// (no te doy use-cases, pero el controller los referencia)
import { ListNotificationJobsUseCase } from './use-cases/list-notification-jobs.usecase';
import { RunDueNotificationsUseCase } from './use-cases/run-due-notifications.usecase';

@ApiTags('admin/notifications')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(GlobalRole.ADMIN)
@Controller('admin/notifications')
export class NotificationsAdminController {
    constructor(
        private readonly listUC: ListNotificationJobsUseCase,
        private readonly runUC: RunDueNotificationsUseCase,
    ) { }

    @Get('jobs')
    @ApiOperation({ summary: 'List notification jobs (admin)' })
    list(@Query() q: ListNotificationJobsDto) {
        return this.listUC.exec({
            status: q.status,
            page: q.page,
            limit: q.limit,
        });
    }

    @Post('run-due')
    @ApiOperation({ summary: 'Process due notification jobs (admin)' })
    runDue(@Query() q: RunDueNotificationsDto) {
        return this.runUC.exec({
            limit: q.limit ?? 50,
            dryRun: q.dryRun ?? false,
        });
    }
}

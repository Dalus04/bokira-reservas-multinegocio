import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser, type JwtUserPayload } from 'src/common/decorators/current-user.decorator';

import { ListMyNotificationsDto } from './dtos/list-my-notifications.dto';

import { ListMyNotificationsUseCase } from './use-cases/list-my-notifications.usecase';
import { GetMyUnreadCountUseCase } from './use-cases/get-my-unread-count.usecase';
import { MarkNotificationReadUseCase } from './use-cases/mark-notification-read.usecase';

@ApiTags('my/notifications')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('my/notifications')
export class NotificationsController {
    constructor(
        private readonly listUC: ListMyNotificationsUseCase,
        private readonly unreadUC: GetMyUnreadCountUseCase,
        private readonly readUC: MarkNotificationReadUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List my notifications (in-app inbox)' })
    list(@CurrentUser() user: JwtUserPayload, @Query() q: ListMyNotificationsDto) {
        return this.listUC.exec({
            userId: user.sub,
            page: q.page,
            limit: q.limit,
        });
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get my unread notifications count' })
    unread(@CurrentUser() user: JwtUserPayload) {
        return this.unreadUC.exec({ userId: user.sub });
    }

    @Patch(':jobId/read')
    @ApiOperation({ summary: 'Mark a notification as read' })
    markRead(
        @CurrentUser() user: JwtUserPayload,
        @Param('jobId') jobId: string,
    ) {
        return this.readUC.exec({ userId: user.sub, jobId });
    }
}

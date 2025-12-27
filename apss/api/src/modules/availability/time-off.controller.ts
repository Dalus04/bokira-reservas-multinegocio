import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';

import { CurrentUser, type JwtUserPayload } from 'src/common/decorators/current-user.decorator';
import { CurrentBusinessRole, type CurrentBusinessRole as CBR } from 'src/common/decorators/current-business-role.decorator';

import { CreateTimeOffDto } from './dtos/create-time-off.dto';
import { UpdateTimeOffDto } from './dtos/update-time-off.dto';

import { ListTimeOffUseCase } from './use-cases/list-time-off.usecase';
import { CreateTimeOffUseCase } from './use-cases/create-time-off.usecase';
import { UpdateTimeOffUseCase } from './use-cases/update-time-off.usecase';
import { DeleteTimeOffUseCase } from './use-cases/delete-time-off.usecase';

@ApiTags('time-off')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard)
@Controller('my/businesses/:businessId/time-off')
export class TimeOffController {
    constructor(
        private readonly listUC: ListTimeOffUseCase,
        private readonly createUC: CreateTimeOffUseCase,
        private readonly updateUC: UpdateTimeOffUseCase,
        private readonly deleteUC: DeleteTimeOffUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List time-off blocks (business or staff)' })
    @ApiQuery({ name: 'staffId', required: false })
    @ApiQuery({ name: 'from', required: false, example: '2025-12-01T00:00:00.000Z' })
    @ApiQuery({ name: 'to', required: false, example: '2025-12-31T23:59:59.000Z' })
    list(
        @Param('businessId') businessId: string,
        @Query('staffId') staffId?: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        return this.listUC.exec({
            businessId,
            staffId,
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
        });
    }

    @Post()
    @ApiOperation({ summary: 'Create time-off block (business-wide or staff)' })
    create(
        @Param('businessId') businessId: string,
        @Body() dto: CreateTimeOffDto,
        @CurrentUser() user: JwtUserPayload,
        @CurrentBusinessRole() businessRole: CBR,
    ) {
        return this.createUC.exec({
            businessId,
            staffId: dto.staffId ? dto.staffId : null,
            startAt: new Date(dto.startAt),
            endAt: new Date(dto.endAt),
            reason: dto.reason ?? null,
            actorUserId: user.sub,
            actorBusinessRole: businessRole,
        });
    }

    @Patch(':timeOffId')
    @ApiOperation({ summary: 'Update time-off block' })
    update(
        @Param('businessId') businessId: string,
        @Param('timeOffId') timeOffId: string,
        @Body() dto: UpdateTimeOffDto,
        @CurrentUser() user: JwtUserPayload,
        @CurrentBusinessRole() businessRole: CBR,
    ) {
        return this.updateUC.exec({
            businessId,
            timeOffId,
            startAt: dto.startAt ? new Date(dto.startAt) : undefined,
            endAt: dto.endAt ? new Date(dto.endAt) : undefined,
            reason: dto.reason,
            actorUserId: user.sub,
            actorBusinessRole: businessRole,
        });
    }

    @Delete(':timeOffId')
    @ApiOperation({ summary: 'Delete time-off block' })
    del(
        @Param('businessId') businessId: string,
        @Param('timeOffId') timeOffId: string,
        @CurrentUser() user: JwtUserPayload,
        @CurrentBusinessRole() businessRole: CBR,
    ) {
        return this.deleteUC.exec({
            businessId,
            timeOffId,
            actorUserId: user.sub,
            actorBusinessRole: businessRole,
        });
    }
}

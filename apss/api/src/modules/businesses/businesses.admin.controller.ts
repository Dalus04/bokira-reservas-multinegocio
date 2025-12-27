import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GlobalRole } from 'src/model/domain/enums/global-role';
import { CurrentUser, type JwtUserPayload } from 'src/common/decorators/current-user.decorator';

import { AdminListBusinessesQueryDto } from './dtos/admin-list-businesses.query';
import { AdminRejectBusinessDto } from './dtos/admin-reject-business.dto';

import { AdminListBusinessesUseCase } from './use-cases/admin-list-pending-businesses.usecase';
import { AdminApproveBusinessUseCase } from './use-cases/admin-approve-business.usecase';
import { AdminRejectBusinessUseCase } from './use-cases/admin-reject-business.usecase';
import { AdminSuspendBusinessUseCase } from './use-cases/admin-suspend-business.usecase';

@ApiTags('admin/businesses')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, RolesGuard)
@Roles(GlobalRole.ADMIN)
@Controller('admin/businesses')
export class BusinessesAdminController {
    constructor(
        private readonly listUC: AdminListBusinessesUseCase,
        private readonly approveUC: AdminApproveBusinessUseCase,
        private readonly rejectUC: AdminRejectBusinessUseCase,
        private readonly suspendUC: AdminSuspendBusinessUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List businesses (admin)' })
    list(@Query() query: AdminListBusinessesQueryDto) {
        return this.listUC.exec(query);
    }

    @Post(':businessId/approve')
    @ApiOperation({ summary: 'Approve business (admin)' })
    approve(@CurrentUser() admin: JwtUserPayload, @Param('businessId') businessId: string) {
        return this.approveUC.exec(businessId, admin.sub);
    }

    @Post(':businessId/reject')
    @ApiOperation({ summary: 'Reject business (admin)' })
    reject(
        @CurrentUser() admin: JwtUserPayload,
        @Param('businessId') businessId: string,
        @Body() dto: AdminRejectBusinessDto,
    ) {
        return this.rejectUC.exec(businessId, admin.sub, dto.reason);
    }

    @Post(':businessId/suspend')
    @ApiOperation({ summary: 'Suspend business (admin)' })
    suspend(@CurrentUser() admin: JwtUserPayload, @Param('businessId') businessId: string, @Body() body: any) {
        return this.suspendUC.exec(businessId, admin.sub, body?.reason);
    }
}

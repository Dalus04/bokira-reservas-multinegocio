import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';
import { BusinessRolesGuard } from 'src/common/guards/business-roles.guard';
import { BusinessRoles } from 'src/common/decorators/business-roles.decorator';
import { BusinessRole } from 'src/model/domain/enums/business-role';

import { AddStaffMemberDto } from './dtos/add-staff-member.dto';
import { UpdateStaffMemberDto } from './dtos/update-staff-member.dto';
import { ListStaffUseCase } from './use-cases/list-staff.usecase';
import { AddStaffMemberUseCase } from './use-cases/add-staff-member.usecase';
import { UpdateStaffMemberUseCase } from './use-cases/update-staff-member.usecase';

@ApiTags('staff')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard)
@Controller('my/businesses/:businessId/staff')
export class StaffController {
    constructor(
        private readonly listUC: ListStaffUseCase,
        private readonly addUC: AddStaffMemberUseCase,
        private readonly updateUC: UpdateStaffMemberUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List staff members of a business (private)' })
    @ApiParam({ name: 'businessId', example: 'cuid_business_id' })
    list(
        @Param('businessId') businessId: string,
        @Query('page') page = '1',
        @Query('limit') limit = '20',
    ) {
        return this.listUC.exec(businessId, Number(page), Number(limit));
    }

    @Post()
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Add staff member (owner/MANAGER)' })
    add(@Param('businessId') businessId: string, @Body() dto: AddStaffMemberDto) {
        return this.addUC.exec(businessId, dto);
    }

    @Patch(':memberId')
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Update staff member (owner/MANAGER)' })
    @ApiParam({ name: 'memberId', example: 'cuid_member_id' })
    update(
        @Param('businessId') businessId: string,
        @Param('memberId') memberId: string,
        @Body() dto: UpdateStaffMemberDto,
    ) {
        return this.updateUC.exec(businessId, memberId, dto);
    }
}

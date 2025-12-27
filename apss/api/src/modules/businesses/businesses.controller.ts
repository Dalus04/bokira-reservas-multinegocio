import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';
import { BusinessRolesGuard } from 'src/common/guards/business-roles.guard';
import { BusinessRoles } from 'src/common/decorators/business-roles.decorator';
import { BusinessRole } from 'src/model/domain/enums/business-role';

import { CurrentUser, type JwtUserPayload } from 'src/common/decorators/current-user.decorator';

import { CreateBusinessDto } from './dtos/create-business.dto';
import { UpdateBusinessDto } from './dtos/update-business.dto';

import { CreateBusinessUseCase } from './use-cases/create-business.usecase';
import { ListMyBusinessesUseCase } from './use-cases/list-my-businesses.usecase';
import { GetBusinessPrivateUseCase } from './use-cases/get-business-private.usecase';
import { UpdateBusinessUseCase } from './use-cases/update-business.usecase';
import { SubmitBusinessForReviewUseCase } from './use-cases/submit-business-for-review.usecase';

@ApiTags('businesses')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard)
@Controller('my/businesses')
export class BusinessesController {
    constructor(
        private readonly createUC: CreateBusinessUseCase,
        private readonly myUC: ListMyBusinessesUseCase,
        private readonly getUC: GetBusinessPrivateUseCase,
        private readonly updateUC: UpdateBusinessUseCase,
        private readonly submitUC: SubmitBusinessForReviewUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create business (owner)' })
    create(@CurrentUser() user: JwtUserPayload, @Body() dto: CreateBusinessDto) {
        return this.createUC.exec(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List my businesses (owner + memberships)' })
    my(@CurrentUser() user: JwtUserPayload, @Query('page') page = '1', @Query('limit') limit = '20') {
        return this.myUC.exec(user.sub, Number(page), Number(limit));
    }

    @Get(':businessId')
    @UseGuards(TenantGuard, BusinessAccessGuard)
    @ApiOperation({ summary: 'Get business by id (owner/member)' })
    get(@Param('businessId') businessId: string) {
        return this.getUC.exec(businessId);
    }

    @Patch(':businessId')
    @UseGuards(TenantGuard, BusinessAccessGuard, BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Update business (owner or MANAGER)' })
    update(@Param('businessId') businessId: string, @Body() dto: UpdateBusinessDto) {
        return this.updateUC.exec(businessId, dto);
    }

    @Post(':businessId/submit-for-review')
    @UseGuards(TenantGuard, BusinessAccessGuard)
    @ApiOperation({ summary: 'Submit business for admin review (owner or member with access)' })
    submit(@Param('businessId') businessId: string) {
        return this.submitUC.exec(businessId);
    }
}

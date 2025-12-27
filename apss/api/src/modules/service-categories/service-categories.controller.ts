import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';
import { BusinessRolesGuard } from 'src/common/guards/business-roles.guard';
import { BusinessRoles } from 'src/common/decorators/business-roles.decorator';
import { BusinessRole } from 'src/model/domain/enums/business-role';

import { CreateServiceCategoryDto } from './dtos/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dtos/update-service-category.dto';
import { ListServiceCategoriesDto } from './dtos/list-service-categories.dto';

import { CreateServiceCategoryUseCase } from './use-cases/create-service-category.usecase';
import { UpdateServiceCategoryUseCase } from './use-cases/update-service-category.usecase';
import { ListServiceCategoriesUseCase } from './use-cases/list-service-categories.usecase';

@ApiTags('service-categories')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard)
@Controller('my/businesses/:businessId/service-categories')
export class ServiceCategoriesController {
    constructor(
        private readonly createUC: CreateServiceCategoryUseCase,
        private readonly updateUC: UpdateServiceCategoryUseCase,
        private readonly listUC: ListServiceCategoriesUseCase,
    ) { }

    @Post()
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Create service category (MANAGER)' })
    create(@Param('businessId') businessId: string, @Body() dto: CreateServiceCategoryDto) {
        return this.createUC.exec({ businessId, name: dto.name });
    }

    @Get()
    @ApiOperation({ summary: 'List service categories (private)' })
    list(@Param('businessId') businessId: string, @Query() q: ListServiceCategoriesDto) {
        return this.listUC.exec({ businessId, q: q.q });
    }

    @Patch(':categoryId')
    @ApiParam({ name: 'categoryId' })
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Rename service category (MANAGER)' })
    update(
        @Param('businessId') businessId: string,
        @Param('categoryId') categoryId: string,
        @Body() dto: UpdateServiceCategoryDto,
    ) {
        return this.updateUC.exec({ businessId, categoryId, name: dto.name });
    }
}

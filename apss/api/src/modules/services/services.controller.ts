import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { BusinessAccessGuard } from 'src/common/guards/business-access.guard';
import { BusinessRolesGuard } from 'src/common/guards/business-roles.guard';
import { BusinessRoles } from 'src/common/decorators/business-roles.decorator';

import { BusinessRole } from 'src/model/domain/enums/business-role';

import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { ListServicesDto } from './dtos/list-services.dto';

import { CreateServiceUseCase } from './use-cases/create-service.usecase';
import { ListServicesUseCase } from './use-cases/list-services.usecase';
import { GetServiceUseCase } from './use-cases/get-service.usecase';
import { UpdateServiceUseCase } from './use-cases/update-service.usecase';
import { ArchiveServiceUseCase } from './use-cases/archive-service.usecase';

@ApiTags('services')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, TenantGuard, BusinessAccessGuard)
@Controller('my/businesses/:businessId/services')
export class ServicesController {
    constructor(
        private readonly createUC: CreateServiceUseCase,
        private readonly listUC: ListServicesUseCase,
        private readonly getUC: GetServiceUseCase,
        private readonly updateUC: UpdateServiceUseCase,
        private readonly archiveUC: ArchiveServiceUseCase,
    ) { }

    @Post()
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Create service (MANAGER)' })
    create(@Param('businessId') businessId: string, @Body() dto: CreateServiceDto) {
        return this.createUC.exec({
            businessId,
            name: dto.name,
            description: dto.description ?? null,
            price: dto.price,
            durationMin: dto.durationMin,
            serviceCategoryId: dto.serviceCategoryId ?? null,
            imageUrl: dto.imageUrl ?? null,
        });
    }

    @Get()
    @ApiOperation({ summary: 'List services (MANAGER/STAFF read)' })
    list(@Param('businessId') businessId: string, @Query() q: ListServicesDto) {
        return this.listUC.exec({
            businessId,
            q: q.q,
            categoryId: q.categoryId,
            isActive: q.isActive,
            page: q.page,
            limit: q.limit,
        });
    }

    @Get(':serviceId')
    @ApiParam({ name: 'serviceId' })
    @ApiOperation({ summary: 'Get service detail' })
    get(@Param('businessId') businessId: string, @Param('serviceId') serviceId: string) {
        return this.getUC.exec({ businessId, serviceId });
    }

    @Patch(':serviceId')
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Update service (MANAGER)' })
    update(
        @Param('businessId') businessId: string,
        @Param('serviceId') serviceId: string,
        @Body() dto: UpdateServiceDto,
    ) {
        return this.updateUC.exec({
            businessId,
            serviceId,
            patch: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                durationMin: dto.durationMin,
                serviceCategoryId: dto.serviceCategoryId,
                imageUrl: dto.imageUrl,
                isActive: dto.isActive,
            },
        });
    }

    @Post(':serviceId/archive')
    @UseGuards(BusinessRolesGuard)
    @BusinessRoles(BusinessRole.MANAGER)
    @ApiOperation({ summary: 'Archive service (soft delete)' })
    archive(@Param('businessId') businessId: string, @Param('serviceId') serviceId: string) {
        return this.archiveUC.exec({ businessId, serviceId });
    }
}

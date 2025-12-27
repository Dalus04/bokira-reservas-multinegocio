import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { TenantGuard } from 'src/common/guards/tenant.guard';
import { Tenant, type TenantContext } from 'src/common/decorators/tenant.decorator';

import { ListPublicServicesDto } from './dtos/list-public-services.dto';
import { ListPublicServicesUseCase } from './use-cases/list-public-services.usecase';
import { GetPublicServiceUseCase } from './use-cases/get-public-service.usecase';

@ApiTags('services')
@ApiParam({ name: 'slug', example: 'barberia-black-beard' })
@UseGuards(TenantGuard)
@Controller('businesses/:slug/services')
export class ServicesPublicController {
    constructor(
        private readonly listUC: ListPublicServicesUseCase,
        private readonly getUC: GetPublicServiceUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List public services by business slug' })
    list(@Tenant() tenant: TenantContext, @Query() q: ListPublicServicesDto) {
        return this.listUC.exec({
            businessId: tenant.businessId,
            q: q.q,
            categoryId: q.categoryId,
            page: q.page,
            limit: q.limit,
        });
    }

    @Get(':serviceId')
    @ApiOperation({ summary: 'Get public service detail' })
    @ApiParam({ name: 'serviceId' })
    get(@Tenant() tenant: TenantContext, @Param('slug') _slug: string, @Param('serviceId') serviceId: string) {
        return this.getUC.exec({ businessId: tenant.businessId, serviceId });
    }
}

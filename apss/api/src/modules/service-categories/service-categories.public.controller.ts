import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { Tenant, type TenantContext } from 'src/common/decorators/tenant.decorator';
import { ListPublicServiceCategoriesUseCase } from './use-cases/list-public-service-categories.usecase';

@ApiTags('service-categories')
@ApiParam({ name: 'slug', example: 'barberia-black-beard' })
@UseGuards(TenantGuard)
@Controller('businesses/:slug/service-categories')
export class ServiceCategoriesPublicController {
    constructor(private readonly listUC: ListPublicServiceCategoriesUseCase) { }

    @Get()
    @ApiOperation({ summary: 'List public service categories by business slug' })
    list(@Tenant() tenant: TenantContext, @Param('slug') _slug: string) {
        return this.listUC.exec({ businessId: tenant.businessId });
    }
}

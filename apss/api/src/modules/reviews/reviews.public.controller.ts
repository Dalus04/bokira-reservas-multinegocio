import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { Tenant, type TenantContext } from 'src/common/decorators/tenant.decorator';

import { ListPublicReviewsDto } from './dtos/list-public-reviews.dto';
import { ListPublicReviewsUseCase } from './use-cases/list-public-reviews.usecase';

@ApiTags('reviews')
@ApiParam({ name: 'slug', example: 'barberia-black-beard' })
@UseGuards(TenantGuard)
@Controller('businesses/:slug/reviews')
export class ReviewsPublicController {
    constructor(private readonly listUC: ListPublicReviewsUseCase) { }

    @Get()
    @ApiOperation({ summary: 'List public reviews by business slug (optional serviceId)' })
    list(
        @Tenant() tenant: TenantContext,
        @Param('slug') _slug: string,
        @Query() q: ListPublicReviewsDto,
    ) {
        return this.listUC.exec({
            businessId: tenant.businessId,
            serviceId: q.serviceId,
            page: q.page,
            limit: q.limit,
        });
    }
}

import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GlobalRole } from 'src/model/domain/enums/global-role';

import { AdminListReviewsDto } from './dtos/admin-list-reviews.dto';
import { AdminUpdateReviewStatusDto } from './dtos/admin-update-review-status.dto';
import { AdminListReviewsUseCase } from './use-cases/admin-list-reviews.usecase';
import { AdminUpdateReviewStatusUseCase } from './use-cases/admin-update-review-status.usecase';

@ApiTags('admin/reviews')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard, RolesGuard)
@Roles(GlobalRole.ADMIN)
@Controller('admin/reviews')
export class ReviewsAdminController {
    constructor(
        private readonly listUC: AdminListReviewsUseCase,
        private readonly setStatusUC: AdminUpdateReviewStatusUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Admin list reviews (filter by businessId/status)' })
    list(@Query() q: AdminListReviewsDto) {
        return this.listUC.exec({
            businessId: q.businessId,
            status: q.status,
            page: q.page,
            limit: q.limit,
        });
    }

    @Patch(':reviewId/status')
    @ApiOperation({ summary: 'Admin update review status (PUBLISHED/HIDDEN)' })
    @ApiParam({ name: 'reviewId' })
    updateStatus(@Param('reviewId') reviewId: string, @Body() dto: AdminUpdateReviewStatusDto) {
        return this.setStatusUC.exec({ reviewId, status: dto.status });
    }
}

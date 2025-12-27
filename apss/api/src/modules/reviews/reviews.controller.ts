import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser, type JwtUserPayload } from 'src/common/decorators/current-user.decorator';

import { CreateReviewDto } from './dtos/create-review.dto';
import { CreateReviewUseCase } from './use-cases/create-review.usecase';

@ApiTags('reviews')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard)
@Controller('my/bookings/:bookingId/review')
export class ReviewsController {
    constructor(private readonly createUC: CreateReviewUseCase) { }

    @Post()
    @ApiOperation({ summary: 'Create review for a booking (customer only, booking must be COMPLETED)' })
    @ApiParam({ name: 'bookingId' })
    create(
        @CurrentUser() user: JwtUserPayload,
        @Param('bookingId') bookingId: string,
        @Body() dto: CreateReviewDto,
    ) {
        return this.createUC.exec({
            bookingId,
            customerId: user.sub,
            rating: dto.rating,
            comment: dto.comment,
        });
    }
}

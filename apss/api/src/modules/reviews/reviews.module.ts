import { Module } from '@nestjs/common';

import { ReviewsPublicController } from './reviews.public.controller';
import { ReviewsController } from './reviews.controller';
import { ReviewsAdminController } from './reviews.admin.controller';

import { ListPublicReviewsUseCase } from './use-cases/list-public-reviews.usecase';
import { CreateReviewUseCase } from './use-cases/create-review.usecase';
import { AdminListReviewsUseCase } from './use-cases/admin-list-reviews.usecase';
import { AdminUpdateReviewStatusUseCase } from './use-cases/admin-update-review-status.usecase';

import { ReviewsPrismaRepo } from 'src/infra/prisma/repositories/reviews.prisma.repo';
import { reviewsRepoProvider } from 'src/infra/prisma/repositories/reviews.repo.provider';

@Module({
    controllers: [ReviewsPublicController, ReviewsController, ReviewsAdminController],
    providers: [
        ListPublicReviewsUseCase,
        CreateReviewUseCase,
        AdminListReviewsUseCase,
        AdminUpdateReviewStatusUseCase,

        ReviewsPrismaRepo,
        reviewsRepoProvider,
    ],
})
export class ReviewsModule { }

import { Inject, Injectable } from '@nestjs/common';
import { REVIEWS_REPO, type ReviewsRepoPort } from 'src/model/ports/repositories/reviews.repo.port';
import { ReviewStatus } from 'src/model/domain/enums/review-status';

@Injectable()
export class AdminListReviewsUseCase {
    constructor(@Inject(REVIEWS_REPO) private readonly repo: ReviewsRepoPort) { }

    exec(input: { businessId?: string; status?: ReviewStatus; page: number; limit: number }) {
        return this.repo.adminList(input);
    }
}

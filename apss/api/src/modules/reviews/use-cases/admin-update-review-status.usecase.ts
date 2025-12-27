import { Inject, Injectable } from '@nestjs/common';
import { REVIEWS_REPO, type ReviewsRepoPort } from 'src/model/ports/repositories/reviews.repo.port';
import { ReviewStatus } from 'src/model/domain/enums/review-status';

@Injectable()
export class AdminUpdateReviewStatusUseCase {
    constructor(@Inject(REVIEWS_REPO) private readonly repo: ReviewsRepoPort) { }

    exec(input: { reviewId: string; status: ReviewStatus }) {
        return this.repo.adminSetStatus(input);
    }
}

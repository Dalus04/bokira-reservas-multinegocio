import { Inject, Injectable } from '@nestjs/common';
import { REVIEWS_REPO, type ReviewsRepoPort } from 'src/model/ports/repositories/reviews.repo.port';

@Injectable()
export class ListPublicReviewsUseCase {
    constructor(@Inject(REVIEWS_REPO) private readonly repo: ReviewsRepoPort) { }

    exec(input: { businessId: string; serviceId?: string; page: number; limit: number }) {
        return this.repo.listPublic(input);
    }
}

import { REVIEWS_REPO } from 'src/model/ports/repositories/reviews.repo.port';
import { ReviewsPrismaRepo } from './reviews.prisma.repo';

export const reviewsRepoProvider = {
    provide: REVIEWS_REPO,
    useClass: ReviewsPrismaRepo,
};

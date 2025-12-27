import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REVIEWS_REPO, type ReviewsRepoPort } from 'src/model/ports/repositories/reviews.repo.port';

@Injectable()
export class CreateReviewUseCase {
    constructor(@Inject(REVIEWS_REPO) private readonly repo: ReviewsRepoPort) { }

    async exec(input: { bookingId: string; customerId: string; rating: number; comment?: string }) {
        const booking = await this.repo.getBookingForReview(input.bookingId);
        if (!booking) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Not found' });

        if (booking.customerId !== input.customerId) {
            throw new ForbiddenException({ code: 'REVIEW_FORBIDDEN', message: 'Not allowed' });
        }

        if (booking.reviewId) {
            throw new ConflictException({ code: 'REVIEW_ALREADY_EXISTS', message: 'Only one review per booking' });
        }

        // regla recomendada: solo cuando se completó el servicio
        if (booking.status !== 'COMPLETED') {
            throw new BadRequestException({ code: 'REVIEW_NOT_ALLOWED', message: 'Booking must be COMPLETED' });
        }

        const created = await this.repo.createForBooking(input);
        if (!created) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Not found' });

        return created;
    }
}

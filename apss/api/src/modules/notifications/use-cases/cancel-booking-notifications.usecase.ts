import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';

@Injectable()
export class CancelBookingNotificationsUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly jobsRepo: NotificationJobsRepoPort,
    ) { }

    async exec(input: { bookingId: string }) {
        await this.jobsRepo.cancelForBooking(input.bookingId);
        return { cancelled: true };
    }
}

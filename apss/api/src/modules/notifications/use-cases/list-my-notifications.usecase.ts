import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';

@Injectable()
export class ListMyNotificationsUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly repo: NotificationJobsRepoPort,
    ) { }

    async exec(input: { userId: string; page: number; limit: number }) {
        return this.repo.listForUser({
            userId: input.userId,
            page: input.page,
            limit: input.limit,
        });
    }
}

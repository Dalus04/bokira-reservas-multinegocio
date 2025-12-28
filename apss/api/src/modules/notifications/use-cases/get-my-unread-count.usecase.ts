import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';

@Injectable()
export class GetMyUnreadCountUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly repo: NotificationJobsRepoPort,
    ) { }

    async exec(input: { userId: string }) {
        const unreadCount = await this.repo.countUnreadForUser(input.userId); 
        return { unreadCount };
    }
}

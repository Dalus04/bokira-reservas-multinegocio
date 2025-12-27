import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';

@Injectable()
export class MarkNotificationReadUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly repo: NotificationJobsRepoPort,
    ) { }

    async exec(input: { userId: string; jobId: string }) {
        await this.repo.markRead({ userId: input.userId, jobId: input.jobId });
        return { ok: true };
    }
}

import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';
import type { NotificationStatus } from 'src/model/domain/enums/notification';

@Injectable()
export class ListMyNotificationsUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly repo: NotificationJobsRepoPort,
    ) { }

    async exec(input: { userId: string; status?: NotificationStatus; page: number; limit: number }) {
        const { items, total } = await this.repo.listForUser({
            userId: input.userId,
            status: input.status,
            page: input.page,
            limit: input.limit,
        });

        return {
            items,
            meta: { page: input.page, limit: input.limit, total },
        };
    }
}

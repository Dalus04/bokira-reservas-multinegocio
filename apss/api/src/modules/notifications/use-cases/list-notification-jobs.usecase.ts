import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_JOBS_REPO, type NotificationJobsRepoPort } from 'src/model/ports/repositories/notification-jobs.repo.port';
import { NotificationStatus } from 'src/model/domain/enums/notification';

@Injectable()
export class ListNotificationJobsUseCase {
    constructor(
        @Inject(NOTIFICATION_JOBS_REPO) private readonly repo: NotificationJobsRepoPort,
    ) { }

    async exec(input: {
        status?: string;
        page: number;
        limit: number;
    }) {
        const status = input.status ? (input.status as NotificationStatus) : undefined;

        return this.repo.list({
            status,
            page: input.page,
            limit: input.limit,
        });
    }
}

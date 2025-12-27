import { NOTIFICATION_JOBS_REPO } from 'src/model/ports/repositories/notification-jobs.repo.port';
import { NotificationJobsPrismaRepo } from './notification-jobs.prisma.repo';

export const notificationJobsRepoProvider = {
    provide: NOTIFICATION_JOBS_REPO,
    useClass: NotificationJobsPrismaRepo,
};

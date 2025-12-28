import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RunDueNotificationsUseCase } from '../use-cases/run-due-notifications.usecase';

@Injectable()
export class NotificationsWorker {
    private readonly logger = new Logger(NotificationsWorker.name);

    constructor(private readonly runDueUC: RunDueNotificationsUseCase) { }

    // cada minuto
    @Cron('*/1 * * * *')
    async handle() {
        try {
            const res = await this.runDueUC.exec({ limit: 50, dryRun: false });
            if (res.picked > 0) {
                this.logger.log(`Processed: picked=${res.picked} sent=${res.sent} failed=${res.failed}`);
            }
        } catch (e: any) {
            this.logger.error(e?.message ?? String(e));
        }
    }
}

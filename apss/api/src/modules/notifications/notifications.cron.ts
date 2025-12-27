import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RunDueNotificationsUseCase } from './use-cases/run-due-notifications.usecase';

@Injectable()
export class NotificationsCron {
    private readonly logger = new Logger(NotificationsCron.name);

    constructor(private readonly runDueUC: RunDueNotificationsUseCase) { }

    // Cada minuto 
    @Cron(CronExpression.EVERY_MINUTE)
    async handleDueJobs() {
        try {
            const res = await this.runDueUC.exec({ limit: 50, dryRun: false });

            // Log corto para no spamear
            if (res.picked > 0) {
                this.logger.log(
                    `run-due: picked=${res.picked} sent=${res.sent} failed=${res.failed}`,
                );
            }
        } catch (err: any) {
            this.logger.error(`run-due failed: ${err?.message ?? String(err)}`);
        }
    }
}

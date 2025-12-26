import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthDbUseCase } from './use-cases/health-db.usecase';

@Module({
    controllers: [HealthController],
    providers: [HealthDbUseCase],
})
export class HealthModule { }

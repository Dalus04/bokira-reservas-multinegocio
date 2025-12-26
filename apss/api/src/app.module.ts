import { Module } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    HealthModule,
    AuthModule,
  ],
})
export class AppModule { }

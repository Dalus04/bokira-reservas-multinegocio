import { Module } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { PlatformCategoriesModule } from './modules/platform-categories/platform-categories.module';
import { BusinessesModule } from './modules/businesses/businesses.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    PlatformCategoriesModule,
    BusinessesModule,
  ],
})
export class AppModule { }

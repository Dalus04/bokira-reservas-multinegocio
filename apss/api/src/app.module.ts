import { Module } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { PlatformCategoriesModule } from './modules/platform-categories/platform-categories.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { StaffModule } from './modules/staff/staff.module';
import { CoreModule } from './common/core/core.module';
import { AvailabilityModule } from './modules/availability/availability.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    CoreModule,
    HealthModule,
    AuthModule,
    PlatformCategoriesModule,
    BusinessesModule,
    StaffModule,
    AvailabilityModule,
  ],
})
export class AppModule { }

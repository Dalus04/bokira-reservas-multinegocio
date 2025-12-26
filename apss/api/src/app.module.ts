import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './infra/prisma/prisma.module';
import { EnvService } from './config/env.service';

import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // ConfigModule solo para cargar .env; validación real la hace EnvService (zod)
    ConfigModule.forRoot({ isGlobal: true }),

    PrismaModule,

    // Features
    HealthModule,
  ],
  providers: [EnvService],
})
export class AppModule { }

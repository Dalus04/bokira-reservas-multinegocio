import { Module } from '@nestjs/common';

import { BusinessHoursController } from './business-hours.controller';
import { StaffWorkingHoursController } from './staff-working-hours.controller';

import { ListBusinessHoursUseCase } from './use-cases/list-business-hours.usecase';
import { UpsertBusinessHoursUseCase } from './use-cases/upsert-business-hours.usecase';
import { ListStaffWorkingHoursUseCase } from './use-cases/list-staff-working-hours.usecase';
import { UpsertStaffWorkingHoursUseCase } from './use-cases/upsert-staff-working-hours.usecase';

import { AvailabilityPrismaRepo } from 'src/infra/prisma/repositories/availability.prisma.repo';
import { availabilityRepoProvider } from 'src/infra/prisma/repositories/availability.repo.provider';

@Module({
    controllers: [BusinessHoursController, StaffWorkingHoursController],
    providers: [
        ListBusinessHoursUseCase,
        UpsertBusinessHoursUseCase,
        ListStaffWorkingHoursUseCase,
        UpsertStaffWorkingHoursUseCase,

        AvailabilityPrismaRepo,
        availabilityRepoProvider,
    ],
})
export class AvailabilityModule { }

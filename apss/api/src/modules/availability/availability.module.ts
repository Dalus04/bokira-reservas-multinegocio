import { Module } from '@nestjs/common';

import { BusinessHoursController } from './business-hours.controller';
import { StaffWorkingHoursController } from './staff-working-hours.controller';
import { TimeOffController } from './time-off.controller';

import { ListBusinessHoursUseCase } from './use-cases/list-business-hours.usecase';
import { UpsertBusinessHoursUseCase } from './use-cases/upsert-business-hours.usecase';
import { ListStaffWorkingHoursUseCase } from './use-cases/list-staff-working-hours.usecase';
import { UpsertStaffWorkingHoursUseCase } from './use-cases/upsert-staff-working-hours.usecase';

import { ListTimeOffUseCase } from './use-cases/list-time-off.usecase';
import { CreateTimeOffUseCase } from './use-cases/create-time-off.usecase';
import { UpdateTimeOffUseCase } from './use-cases/update-time-off.usecase';
import { DeleteTimeOffUseCase } from './use-cases/delete-time-off.usecase';

import { AvailabilityPrismaRepo } from 'src/infra/prisma/repositories/availability.prisma.repo';
import { availabilityRepoProvider } from 'src/infra/prisma/repositories/availability.repo.provider';

import { TimeOffPrismaRepo } from '../../infra/prisma/repositories/time-off.prisma.repo';
import { timeOffRepoProvider } from '../../infra/prisma/repositories/time-off.repo.provider';

import { AvailabilityPublicController } from './availability.public.controller';
import { AvailabilityController } from './availability.controller';
import { GetAvailabilitySlotsUseCase } from './use-cases/get-availability-slots.usecase';

import { ServicesPrismaRepo } from '../../infra/prisma/repositories/services.prisma.repo';
import { servicesRepoProvider } from '../../infra/prisma/repositories/services.repo.provider';

@Module({
    controllers: [
        BusinessHoursController,
        StaffWorkingHoursController,
        TimeOffController,
        AvailabilityPublicController,
        AvailabilityController,
    ], providers: [
        ListBusinessHoursUseCase,
        UpsertBusinessHoursUseCase,
        ListStaffWorkingHoursUseCase,
        UpsertStaffWorkingHoursUseCase,
        ListTimeOffUseCase,
        CreateTimeOffUseCase,
        UpdateTimeOffUseCase,
        DeleteTimeOffUseCase,
        TimeOffPrismaRepo,
        timeOffRepoProvider,

        AvailabilityPrismaRepo,
        availabilityRepoProvider,

        GetAvailabilitySlotsUseCase,

        ServicesPrismaRepo,
        servicesRepoProvider,
    ],
    exports: [GetAvailabilitySlotsUseCase],
})
export class AvailabilityModule { }

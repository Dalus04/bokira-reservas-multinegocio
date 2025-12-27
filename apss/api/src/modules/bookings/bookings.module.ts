import { Module } from '@nestjs/common';

import { BookingsPublicController } from './bookings.public.controller';
import { BookingsController } from './bookings.controller';

import { CreateBookingPublicUseCase } from './use-cases/create-booking.public.usecase';
import { ListBookingsUseCase } from './use-cases/list-bookings.usecase';
import { GetBookingUseCase } from './use-cases/get-booking.usecase';
import { ConfirmBookingUseCase } from './use-cases/confirm-booking.usecase';
import { CancelBookingUseCase } from './use-cases/cancel-booking.usecase';
import { RescheduleBookingUseCase } from './use-cases/reschedule-booking.usecase';

import { BookingsPrismaRepo } from 'src/infra/prisma/repositories/bookings.prisma.repo';
import { bookingsRepoProvider } from 'src/infra/prisma/repositories/bookings.repo.provider';

import { ServicesPrismaRepo } from 'src/infra/prisma/repositories/services.prisma.repo';
import { servicesRepoProvider } from 'src/infra/prisma/repositories/services.repo.provider';

import { AvailabilityModule } from '../availability/availability.module';

@Module({
    imports: [AvailabilityModule],
    controllers: [BookingsPublicController, BookingsController],
    providers: [
        CreateBookingPublicUseCase,
        ListBookingsUseCase,
        GetBookingUseCase,
        ConfirmBookingUseCase,
        CancelBookingUseCase,
        RescheduleBookingUseCase,

        BookingsPrismaRepo,
        bookingsRepoProvider,

        // deps (porque no existe ServicesModule)
        ServicesPrismaRepo,
        servicesRepoProvider,
    ],
})
export class BookingsModule { }

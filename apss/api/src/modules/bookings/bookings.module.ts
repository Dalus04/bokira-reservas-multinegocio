import { Module } from '@nestjs/common';

import { BookingsController } from './bookings.controller';
import { BookingsPublicController } from './bookings.public.controller';

import { BookingsPrismaRepo } from 'src/infra/prisma/repositories/bookings.prisma.repo';
import { bookingsRepoProvider } from 'src/infra/prisma/repositories/bookings.repo.provider';

import { ListBookingsUseCase } from './use-cases/list-bookings.usecase';
import { GetBookingUseCase } from './use-cases/get-booking.usecase';
import { CreateBookingPublicUseCase } from './use-cases/create-booking.public.usecase';
import { ConfirmBookingUseCase } from './use-cases/confirm-booking.usecase';
import { CancelBookingUseCase } from './use-cases/cancel-booking.usecase';
import { RescheduleBookingUseCase } from './use-cases/reschedule-booking.usecase';
import { CompleteBookingUseCase } from './use-cases/complete-booking.usecase';

import { AvailabilityModule } from 'src/modules/availability/availability.module';

import { ServicesPrismaRepo } from 'src/infra/prisma/repositories/services.prisma.repo';
import { servicesRepoProvider } from 'src/infra/prisma/repositories/services.repo.provider';

@Module({
    imports: [
        AvailabilityModule, // para Create/Reschedule
    ],
    controllers: [BookingsController, BookingsPublicController],
    providers: [
        // repos
        BookingsPrismaRepo,
        bookingsRepoProvider,

        ServicesPrismaRepo,
        servicesRepoProvider,

        // use-cases
        ListBookingsUseCase,
        GetBookingUseCase,
        CreateBookingPublicUseCase,
        ConfirmBookingUseCase,
        CancelBookingUseCase,
        RescheduleBookingUseCase,
        CompleteBookingUseCase,
    ],
})
export class BookingsModule { }

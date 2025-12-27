import { BOOKINGS_REPO } from 'src/model/ports/repositories/bookings.repo.port';
import { BookingsPrismaRepo } from './bookings.prisma.repo';

export const bookingsRepoProvider = {
    provide: BOOKINGS_REPO,
    useClass: BookingsPrismaRepo,
};

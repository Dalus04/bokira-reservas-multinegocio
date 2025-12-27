import { AVAILABILITY_REPO } from 'src/model/ports/repositories/availability.repo.port';
import { AvailabilityPrismaRepo } from './availability.prisma.repo';

export const availabilityRepoProvider = {
    provide: AVAILABILITY_REPO,
    useClass: AvailabilityPrismaRepo,
};

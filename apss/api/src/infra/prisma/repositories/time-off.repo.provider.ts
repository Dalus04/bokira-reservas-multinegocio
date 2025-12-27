import { TIME_OFF_REPO } from 'src/model/ports/repositories/time-off.repo.port';
import { TimeOffPrismaRepo } from './time-off.prisma.repo';

export const timeOffRepoProvider = {
    provide: TIME_OFF_REPO,
    useClass: TimeOffPrismaRepo,
};

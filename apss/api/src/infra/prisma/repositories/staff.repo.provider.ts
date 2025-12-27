import { STAFF_REPO } from '../../../model/ports/repositories/staff.repo.port';
import { StaffPrismaRepo } from './staff.prisma.repo';

export const staffRepoProvider = {
    provide: STAFF_REPO,
    useClass: StaffPrismaRepo,
};

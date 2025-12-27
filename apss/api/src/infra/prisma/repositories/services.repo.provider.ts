import { SERVICES_REPO } from 'src/model/ports/repositories/services.repo.port';
import { ServicesPrismaRepo } from './services.prisma.repo';

export const servicesRepoProvider = {
    provide: SERVICES_REPO,
    useClass: ServicesPrismaRepo,
};

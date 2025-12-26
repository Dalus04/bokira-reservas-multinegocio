import { USERS_REPO } from "src/model/ports/repositories/users.repo.port";
import { UsersPrismaRepo } from './users.prisma.repo';

export const usersRepoProvider = {
    provide: USERS_REPO,
    useClass: UsersPrismaRepo,
};

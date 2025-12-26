import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPO, type UsersRepoPort } from 'src/model/ports/repositories/users.repo.port';

@Injectable()
export class MeUseCase {
    constructor(@Inject(USERS_REPO) private readonly usersRepo: UsersRepoPort) { }

    async exec(userId: string) {
        const user = await this.usersRepo.findSafeById(userId);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}

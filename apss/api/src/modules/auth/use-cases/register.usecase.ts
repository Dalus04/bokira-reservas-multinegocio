import { ConflictException, Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { USERS_REPO, type UsersRepoPort } from 'src/model/ports/repositories/users.repo.port';
import { GlobalRole } from 'src/model/domain/enums/global-role';

@Injectable()
export class RegisterUseCase {
    constructor(@Inject(USERS_REPO) private readonly usersRepo: UsersRepoPort) { }

    async exec(input: { email: string; password: string; name: string; phone?: string }) {
        const existing = await this.usersRepo.findByEmail(input.email);
        if (existing) throw new ConflictException('Email already registered');

        const passwordHash = await bcrypt.hash(input.password, 10);

        return this.usersRepo.create({
            email: input.email,
            passwordHash,
            name: input.name,
            phone: input.phone ?? null,
            globalRole: GlobalRole.USER,
            isActive: true,
        });
    }
}

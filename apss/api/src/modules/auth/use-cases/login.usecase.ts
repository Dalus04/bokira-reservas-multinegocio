import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { USERS_REPO, type UsersRepoPort } from 'src/model/ports/repositories/users.repo.port';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USERS_REPO) private readonly usersRepo: UsersRepoPort,
        private readonly jwt: JwtService,
    ) { }

    async exec(input: { email: string; password: string }) {
        const user = await this.usersRepo.findByEmail(input.email);
        if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(input.password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        const token = await this.jwt.signAsync({
            sub: user.id,
            email: user.email,
            globalRole: user.globalRole,
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                globalRole: user.globalRole,
            },
        };
    }
}

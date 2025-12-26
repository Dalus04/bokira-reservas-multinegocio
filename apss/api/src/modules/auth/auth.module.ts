import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from 'src/config/env.service';
import { AuthController } from './auth.controller';
import { RegisterUseCase } from './use-cases/register.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { MeUseCase } from './use-cases/me.usecase';
import { JwtStrategy } from './strategies/jwt.strategy';
import type { StringValue } from 'ms';
import { UsersPrismaRepo } from 'src/infra/prisma/repositories/users.prisma.repo';
import { usersRepoProvider } from 'src/infra/prisma/repositories/users.repo.provider';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [EnvService],
            useFactory: (env: EnvService) => ({
                secret: env.get('JWT_SECRET'),
                signOptions: { expiresIn: env.get('JWT_EXPIRES_IN') as StringValue },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        RegisterUseCase,
        LoginUseCase,
        MeUseCase,
        JwtStrategy,
        UsersPrismaRepo,
        usersRepoProvider,
    ],
    exports: [],
})
export class AuthModule { }

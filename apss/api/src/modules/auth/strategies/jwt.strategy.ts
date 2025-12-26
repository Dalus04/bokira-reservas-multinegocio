import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from 'src/config/env.service';
import type { JwtUserPayload } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(env: EnvService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: env.get('JWT_SECRET'),
        });
    }

    async validate(payload: JwtUserPayload) {
        // Este objeto se inyecta en req.user
        return payload;
    }
}

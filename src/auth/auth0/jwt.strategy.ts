import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { parseEnv } from 'src/common/common.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        const config = parseEnv()
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.key,
        })
    }

    async validate(payload: any) {
        return payload
    }
}
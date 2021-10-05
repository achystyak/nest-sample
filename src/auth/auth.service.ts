import { ForbiddenException, forwardRef, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/api/user/entities/user.entity';
import { SessionService } from 'src/api/session/session.service';
// import { AbilityFactory } from './ability/ability.factory';

const jwt = require('jsonwebtoken')

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
        @Inject(forwardRef(() => SessionService)) private readonly sessionService: SessionService,
        // @Inject(forwardRef(() => AbilityFactory)) private abilityFactory: AbilityFactory,
        @Inject(forwardRef(() => JwtService)) private readonly jwtService: JwtService) {
    }

    private readonly logger = new Logger(AuthService.name)

    async login(user: any) {
        const session = await this.sessionService.sessionFor(user)
        if (session) {
            const payload = { id: user.id }
            return {
                id: user?._id?.toString() ?? user?.id,
                refresh: session.secret,
                access: this.jwtService.sign(payload),
            }
        }
        throw new UnauthorizedException()
    }

    // Ability
    // =================================================================================================================

    // async able<Entity extends BaseEntity>(session: User, action: Action, entity: Entity): Promise<Entity> {
    //     const ability = await this.abilityFactory.createForUser(session)
    //     if (!ability.can(action, entity)) {
    //         throw new ForbiddenException('Forbidden resource')
    //     }
    //     return entity
    // }

    // async ableAll<Entity extends BaseEntity>(session: User, action: Action, entities: Entity[]): Promise<Entity[]> {
    //     const ability = await this.abilityFactory.createForUser(session)
    //     if (!entities.every(entity => ability.can(action, entity))) {
    //         throw new ForbiddenException('Forbidden resource')
    //     }
    //     return entities
    // }

    // async ableOrNull<Entity extends BaseEntity>(session: User, action: Action, entity: Entity): Promise<Entity> {
    //     const ability = await this.abilityFactory.createForUser(session)
    //     return ability.can(action, entity) ? entity : null
    // }

    // async ableFilter<Entity extends BaseEntity>(session: User, action: Action, entities: Entity[]): Promise<Entity[]> {
    //     const ability = await this.abilityFactory.createForUser(session)
    //     return entities.filter(entity => ability.can(action, entity))
    // }

    // User Validation
    // =================================================================================================================

    async validateUser(email: string, password: string): Promise<User> {
        this.logger.warn("Login email: [" + email + ":" + password + "]")
        const user = await this.usersService.findByCreds(email, password)
        if (user) {
            const { password, ...result } = user;
            this.logger.warn("Email auth granted: [" + email + ": " + result.id + "]")
            return user
        }
        this.logger.warn("Wrong email: " + email)
        return null
    }

    async jwtUser(token: string): Promise<User> {
        const jwtToken = token?.split("Bearer ")?.join("")?.trim() ?? null
        if (jwtToken) {
            const decoded = jwt.decode(jwtToken)
            if (decoded?.exp && (decoded?.exp - (Date.now() / 1000)) > 0) {
                const user = await this.usersService.findOne(decoded?.id)
                if (user) {
                    return user
                }
            }
        }
    }

    // Prolonging
    // =================================================================================================================

    async prolongSession(token: string): Promise<User> {
        this.logger.warn("Prolonging session...")
        let user = await this.sessionService.user(token)
        if (user) {
            user = await this.sessionService.prolong(user, token)
            if (user) {
                this.logger.log("Session prolonged: [" + user + "]")
                return user
            }
        }
        this.logger.error("Prolonging session failed: [" + token + "]")
        return undefined
    }
}
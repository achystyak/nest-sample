import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/api/user/user.service';
import { User } from 'src/api/user/entities/user.entity';
import { v4 as uuid } from 'uuid'
import { UserSession } from './entities/session.entity';

const sha256 = require('js-sha256').sha256

@Injectable()
export class SessionService {

    public constructor(
        @InjectRepository(UserSession) private sessionRepository: Repository<UserSession>,
        @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    ) {
    }

    // Accessors
    // ===============================================================================================

    async findOne(id: string): Promise<UserSession> {
        return await this.sessionRepository.findOne(id);
    }

    async findBySecret(secret: string): Promise<UserSession> {
        return await this.sessionRepository.findOne({ secret });
    }

    async findByUser(userId: string): Promise<UserSession[]> {
        const user = await this.usersService.findOne(userId);
        return user && await this.sessionRepository.find({ user });
    }

    async findOneByUser(userId: string): Promise<UserSession> {
        const user = await this.usersService.findOne(userId);
        return user && await this.sessionRepository.findOne({ user });
    }

    async removeByUser(userId: string): Promise<UserSession[]> {
        const sessions = await this.findByUser(userId) ?? [];
        return sessions && await this.sessionRepository.remove(sessions);
    }

    // Resolve Fields
    // ===============================================================================================

    async user(secret: string): Promise<User> {
        const session = await this.findBySecret(secret)
        if (session?.user?.id) {
            return await this.usersService.findOne(session.user.id)
        }
        return null
    }

    // Public Methods
    // ===============================================================================================

    async prolong(user: User, token: string): Promise<User> {
        const session = await this.findOneByUser(user.id)
        if (session?.secret == token) {
            const newUserSession = await this.update(session, user)
            if (newUserSession && newUserSession.secret !== token) {
                return await this.usersService.findOne(user.id)
            }
        }
        return undefined
    }

    async sessionFor(user: User): Promise<UserSession> {
        if (!user?.id) {
            return null
        }
        let sessions = await this.findByUser(user.id)
        let session: UserSession = null
        if (sessions.length != 1) {
            await this.removeByUser(user.id)
            session = await this.create(user)
        } else {
            session = sessions[0]
        }
        return session
    }

    // Private Methods
    // ===============================================================================================

    private async create(user: User): Promise<UserSession> {
        return await this.sessionRepository.save(new UserSession({
            secret: this.longToken(),
            user
        }))
    }

    private async update(session: UserSession, user: User): Promise<UserSession> {
        session.secret = this.longToken()
        await this.sessionRepository.update({ id: session.id }, session)
        return await this.findOneByUser(user.id)
    }

    private longToken(): string {
        return sha256(uuid())
    }
}

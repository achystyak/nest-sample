import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../api/user/user.entity';
import { UserService } from '../api/user/user.service';

@Injectable()
export class PublisherService {

    constructor(
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    ) { }

    private users = new Map<string, User>();

    public async verify(token: string | undefined, id: string): Promise<boolean> {
        if (!token?.length) {
            return false;
        }
        const user = await this.authService.jwtUser(token);
        if (user) {
            this.users.set(id, user);
            return true;
        }
        return false;
    }

    public clients(users: User[]): string[] {
        const result = [];
        this.users.forEach((value, key) => {
            if (users.some(user => user?.id == value?.id)) {
                result.push(key)
            }
        });
        return result;
    }
}

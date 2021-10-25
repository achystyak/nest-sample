import { createParamDecorator, ExecutionContext, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/api/user/user.entity';

export const RestSession = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        try {
            const ctx = context.switchToHttp().getRequest()
            const user = ctx.user
            return user as User
        } catch {
            throw new UnauthorizedException()
        }
    },
);
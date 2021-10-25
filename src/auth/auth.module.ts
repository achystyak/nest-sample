import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/api/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth0/jwt.strategy';
import { LocalStrategy } from './auth0/local.strategy';
import { SessionModule } from 'src/auth/session/session.module';
import { parseEnv } from 'src/common/common.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const env = parseEnv()
        return {
          secret: env.jwt.key,
          signOptions: { expiresIn: '4h' },
        }
      }
    }),
    forwardRef(() => SessionModule),
    forwardRef(() => UserModule)
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }

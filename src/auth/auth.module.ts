import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/api/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth0/jwt.strategy';
import { LocalStrategy } from './auth0/local.strategy';
import { SessionModule } from 'src/api/session/session.module';
import * as fs from 'fs'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const config = JSON.parse(fs.readFileSync('.env.json') + "")
        return {
          secret: config.jwt.key,
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

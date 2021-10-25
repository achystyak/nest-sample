import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/api/user/user.module';
import { AuthModule } from '../auth.module';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { UserSession } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSession]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService]
})
export class SessionModule { }

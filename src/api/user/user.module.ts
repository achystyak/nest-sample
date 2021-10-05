import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoomModule } from '../room/room.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  forwardRef(() => RoomModule),
  forwardRef(() => MessageModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }

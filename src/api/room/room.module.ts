import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from './entities/room.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]),
  forwardRef(() => AuthModule),
  forwardRef(() => UserModule),
  forwardRef(() => MessageModule),
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule { }

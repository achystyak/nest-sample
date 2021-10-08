import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PublisherModule } from '../publisher/publisher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => AuthModule),
    forwardRef(() => RoomModule),
    forwardRef(() => UserModule),
    forwardRef(() => PublisherModule),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessageModule { }

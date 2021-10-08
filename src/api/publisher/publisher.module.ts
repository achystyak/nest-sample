import { forwardRef, Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherGateway } from './publisher.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => RoomModule),
    forwardRef(() => MessageModule),
  ],
  providers: [PublisherGateway, PublisherService],
  exports: [PublisherGateway]
})
export class PublisherModule { }

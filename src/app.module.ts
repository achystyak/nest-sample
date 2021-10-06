import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './api/user/entities/user.entity';
import { UserModule } from './api/user/user.module';
import * as fs from 'fs'
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './api/session/session.module';
import { UserSession } from './api/session/entities/session.entity';
import { RoomModule } from './api/room/room.module';
import { MessageModule } from './api/message/message.module';
import { Message } from './api/message/entities/message.entity';
import { Room } from './api/room/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const env = JSON.parse(fs.readFileSync('.env.json') + "")
        return {
          type: 'mysql',
          host: env.db.host,
          port: env.db.port,
          username: env.db.user,
          password: env.db.secret,
          database: env.db.name,
          entities: [User, UserSession, Message, Room],
          synchronize: env.db.sync,
        };
      }
    }),
    AuthModule,
    SessionModule,
    UserModule,
    RoomModule,
    MessageModule
  ],
})
export class AppModule { }

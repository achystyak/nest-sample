import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './api/user/user.entity';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './auth/session/session.module';
import { UserSession } from './auth/session/entities/session.entity';
import { PurseModule } from './api/purse/purse.module';
import { Purse } from './api/purse/purse.entity';
import { parseEnv } from './common/common.config';
import { EnvelopeModule } from './api/envelope/envelope.module';
import { PocketModule } from './api/pocket/pocket.module';
import { ExpenseModule } from './api/expense/expense.module';
import { MoneyboxModule } from './api/moneybox/moneybox.module';
import { Envelope } from './api/envelope/envelope.entity';
import { Pocket } from './api/pocket/pocket.entity';
import { Expense } from './api/expense/expense.entity';
import { Moneybox } from './api/moneybox/moneybox.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const env = parseEnv()
        return {
          type: 'mysql',
          host: env.db.host,
          port: env.db.port,
          username: env.db.user,
          password: env.db.secret,
          database: env.db.name,
          entities: [User, UserSession, Purse, Moneybox, Envelope, Pocket, Expense],
          synchronize: env.db.sync,
        };
      }
    }),
    AuthModule,
    SessionModule,
    UserModule,
    PurseModule,
    EnvelopeModule,
    PocketModule,
    ExpenseModule,
    MoneyboxModule
  ],
})
export class AppModule { }

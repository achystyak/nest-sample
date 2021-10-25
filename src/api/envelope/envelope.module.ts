import { forwardRef, Module } from '@nestjs/common';
import { EnvelopeService } from './envelope.service';
import { EnvelopeController } from './envelope.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Envelope } from './envelope.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';
import { PublisherModule } from 'src/publisher/publisher.module';
import { PurseModule } from '../purse/purse.module';
import { MoneyboxModule } from '../moneybox/moneybox.module';
import { ExpenseModule } from '../expense/expense.module';
import { PocketModule } from '../pocket/pocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Envelope]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => PurseModule),
    forwardRef(() => MoneyboxModule),
    forwardRef(() => PocketModule),
    forwardRef(() => ExpenseModule),
    forwardRef(() => PublisherModule),
  ],
  controllers: [EnvelopeController],
  providers: [EnvelopeService],
  exports: [EnvelopeService]
})
export class EnvelopeModule { }

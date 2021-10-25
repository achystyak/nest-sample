import { forwardRef, Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { Expense } from './expense.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';
import { PublisherModule } from 'src/publisher/publisher.module';
import { PurseModule } from '../purse/purse.module';
import { EnvelopeModule } from '../envelope/envelope.module';
import { PocketModule } from '../pocket/pocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => PurseModule),
    forwardRef(() => EnvelopeModule),
    forwardRef(() => PocketModule),
    forwardRef(() => PublisherModule),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService]
})
export class ExpenseModule { }

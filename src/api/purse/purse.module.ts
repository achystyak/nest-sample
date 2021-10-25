import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurseService } from './purse.service';
import { PurseController } from './purse.controller';
import { Purse } from './purse.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PublisherModule } from '../../publisher/publisher.module';
import { EnvelopeModule } from '../envelope/envelope.module';
import { ExpenseModule } from '../expense/expense.module';
import { PocketModule } from '../pocket/pocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purse]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => EnvelopeModule),
    forwardRef(() => ExpenseModule),
    forwardRef(() => PocketModule),
    forwardRef(() => PublisherModule),
  ],
  controllers: [PurseController],
  providers: [PurseService],
  exports: [PurseService]
})
export class PurseModule { }

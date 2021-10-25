import { forwardRef, Module } from '@nestjs/common';
import { PocketService } from './pocket.service';
import { PocketController } from './pocket.controller';
import { Pocket } from './pocket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PublisherModule } from 'src/publisher/publisher.module';
import { PurseModule } from '../purse/purse.module';
import { EnvelopeModule } from '../envelope/envelope.module';
import { ExpenseModule } from '../expense/expense.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pocket]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => PurseModule),
    forwardRef(() => EnvelopeModule),
    forwardRef(() => ExpenseModule),
    forwardRef(() => PublisherModule),
  ],
  controllers: [PocketController],
  providers: [PocketService],
  exports: [PocketService]
})
export class PocketModule { }

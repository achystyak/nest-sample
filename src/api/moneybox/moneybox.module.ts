import { forwardRef, Module } from '@nestjs/common';
import { MoneyboxService } from './moneybox.service';
import { MoneyboxController } from './moneybox.controller';
import { Moneybox } from './moneybox.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';
import { PublisherModule } from 'src/publisher/publisher.module';
import { EnvelopeModule } from '../envelope/envelope.module';
import { PurseModule } from '../purse/purse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Moneybox]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => EnvelopeModule),
    forwardRef(() => PurseModule),
    forwardRef(() => PublisherModule),
  ],
  controllers: [MoneyboxController],
  providers: [MoneyboxService],
  exports: [MoneyboxService]
})
export class MoneyboxModule { }

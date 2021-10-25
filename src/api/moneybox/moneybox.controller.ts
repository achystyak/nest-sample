import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { MoneyboxService } from './moneybox.service';
import { CreateMoneyboxDto } from './dto/create-moneybox.dto';
import { AuthGuard } from '@nestjs/passport';
import { RestSession } from 'src/common/common.decorators';
import { User } from '../user/user.entity';
import { EnvelopeService } from '../envelope/envelope.service';
import { Moneybox } from './moneybox.entity';

@Controller('moneyboxes')
export class MoneyboxController {
  constructor(
    private readonly moneyboxService: MoneyboxService,
    @Inject(forwardRef(() => EnvelopeService)) private readonly envelopeService: EnvelopeService,
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @RestSession() session: User,
    @Body() input: CreateMoneyboxDto) {
    return await this.moneyboxService.create(session, input);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findByUser(
    @RestSession() session: User) {
    return await this.moneyboxService.findByUser(session);
  }

  @Get('/:id/envelopes')
  @UseGuards(AuthGuard('jwt'))
  async envelopes(
    @RestSession() session: User,
    @Param('id') id: string) {
    return await this.envelopeService.findByMoneybox(session, id);
  }
}

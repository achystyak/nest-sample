import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { PurseService } from './purse.service';
import { CreatePurseDto } from './dto/purse.dto';
import { RestSession } from 'src/common/common.decorators';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { EnvelopeService } from '../envelope/envelope.service';
import { PocketService } from '../pocket/pocket.service';
import { ExpenseService } from '../expense/expense.service';
import { Purse } from './purse.entity';
import { Envelope } from '../envelope/envelope.entity';
import { Pocket } from '../pocket/pocket.entity';
import { Expense } from '../expense/expense.entity';

@Controller('purses')
export class PurseController {
  constructor(
    private readonly purseService: PurseService,
    @Inject(forwardRef(() => EnvelopeService)) private readonly envelopeService: EnvelopeService,
    @Inject(forwardRef(() => PocketService)) private readonly pocketService: PocketService,
    @Inject(forwardRef(() => ExpenseService)) private readonly expenseService: ExpenseService,
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @RestSession() session: User,
    @Body() input: CreatePurseDto) {
    return await this.purseService.create(session, input);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findByUser(
    @RestSession() session: User) {
    return await this.purseService.findByUser(session);
  }

  @Get('/:id/envelopes')
  @UseGuards(AuthGuard('jwt'))
  async envelopes(
    @RestSession() session: User,
    @Param('id') id: string) {
    return await this.envelopeService.findByPurse(session, id);
  }

  @Get('/:id/pockets')
  @UseGuards(AuthGuard('jwt'))
  async pockets(
    @RestSession() session: User,
    @Param('id') id: string) {
    return await this.pocketService.findByPurse(session, id);
  }

  @Get('/:id/expenses')
  @UseGuards(AuthGuard('jwt'))
  async expenses(
    @RestSession() session: User,
    @Param('id') id: string) {
    return await this.expenseService.findByPurse(session, id);
  }
}

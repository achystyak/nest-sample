import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, forwardRef, Inject } from '@nestjs/common';
import { EnvelopeService } from './envelope.service';
import { CreateEnvelopeDto } from './dto/create-envelope.dto';
import { AuthGuard } from '@nestjs/passport';
import { RestSession } from 'src/common/common.decorators';
import { User } from '../user/user.entity';
import { PocketService } from '../pocket/pocket.service';
import { ExpenseService } from '../expense/expense.service';

@Controller('envelopes')
export class EnvelopeController {
  constructor(private readonly envelopeService: EnvelopeService,
    @Inject(forwardRef(() => PocketService)) private readonly pocketService: PocketService,
    @Inject(forwardRef(() => ExpenseService)) private readonly expenseService: ExpenseService,
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @RestSession() session: User,
    @Body() input: CreateEnvelopeDto) {
    return await this.envelopeService.create(session, input);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findByUser(
    @RestSession() session: User) {
    return await this.envelopeService.findByUser(session);
  }

  @Get('/:id/pockets')
  @UseGuards(AuthGuard('jwt'))
  async envelopes(
    @RestSession() session: User,
    @Param('id') id: string) {
    return await this.pocketService.findByEnvelope(session, id);
  }

  @Get('/:id/expenses')
  @UseGuards(AuthGuard('jwt'))
  async expenses(
    @RestSession() session: User,
    @Param('id') id: string) {
    return await this.expenseService.findByEnvelope(session, id);
  }
}

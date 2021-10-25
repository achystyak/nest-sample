import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { PocketService } from './pocket.service';
import { CreatePocketDto } from './dto/create-pocket.dto';
import { AuthGuard } from '@nestjs/passport';
import { RestSession } from 'src/common/common.decorators';
import { User } from '../user/user.entity';
import { ExpenseService } from '../expense/expense.service';
import { Expense } from '../expense/expense.entity';
import { Pocket } from './pocket.entity';

@Controller('pockets')
export class PocketController {
  constructor(
    private readonly pocketService: PocketService,
    @Inject(forwardRef(() => ExpenseService)) private readonly expenseService: ExpenseService,
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @RestSession() session: User,
    @Body() input: CreatePocketDto) {
    return await this.pocketService.create(session, input);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findByUser(
    @RestSession() session: User) {
    return await this.pocketService.findByUser(session);
  }

  @Get('/:id/expenses')
  @UseGuards(AuthGuard('jwt'))
  async envelopes(
    @RestSession() session: User,
    @Param('id') id: string) {
    return await this.expenseService.findByPocket(session, id);
  }
}

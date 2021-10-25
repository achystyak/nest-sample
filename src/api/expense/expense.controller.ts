import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { User } from '../user/user.entity';
import { RestSession } from 'src/common/common.decorators';
import { AuthGuard } from '@nestjs/passport';
import { Expense } from './expense.entity';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @RestSession() session: User,
    @Body() input: CreateExpenseDto) {
    return await this.expenseService.create(session, input);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findByUser(
    @RestSession() session: User) {
    return await this.expenseService.findByUser(session.id);
  }
}

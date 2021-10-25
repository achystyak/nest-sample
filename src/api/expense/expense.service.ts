import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnvelopeService } from '../envelope/envelope.service';
import { PocketService } from '../pocket/pocket.service';
import { PurseService } from '../purse/purse.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expense.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) private repository: Repository<Expense>,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    @Inject(forwardRef(() => PurseService)) private readonly purseService: PurseService,
    @Inject(forwardRef(() => EnvelopeService)) private readonly envelopeService: EnvelopeService,
    @Inject(forwardRef(() => PocketService)) private readonly pocketService: PocketService,
  ) { }

  async findOne(id: string): Promise<Expense> {
    return new Expense(await this.repository
      .createQueryBuilder('expense')
      .select(['expense'])
      .andWhere('pocket.id = :oid', { oid: id })
      .getOne());
  }

  async findByPocket(session: User, id: string): Promise<Expense[]> {
    return (await this.repository
      .createQueryBuilder('expense')
      .leftJoin('expense.pocket', 'pocket')
      .leftJoin('pocket.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .select(['expense'])
      .andWhere('pocket.id = :oid', { oid: id })
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('expense.createdAt', 'DESC')
      .getMany()).map(e => new Expense(e));
  }

  async findByEnvelope(session: User, id: string): Promise<Expense[]> {
    return (await this.repository
      .createQueryBuilder('expense')
      .leftJoin('expense.envelope', 'envelope')
      .leftJoin('envelope.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .select(['expense'])
      .andWhere('envelope.id = :oid', { oid: id })
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('expense.createdAt', 'DESC')
      .getMany()).map(e => new Expense(e));
  }

  async findByPurse(session: User, id: string): Promise<Expense[]> {
    return (await this.repository
      .createQueryBuilder('expense')
      .leftJoin('expense.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .select(['expense'])
      .andWhere('purse.id = :oid', { oid: id })
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('expense.createdAt', 'DESC')
      .getMany()).map(e => new Expense(e));
  }

  async findByUser(id: string): Promise<Expense[]> {
    return (await this.repository
      .createQueryBuilder('expense')
      .leftJoin('expense.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .select(['expense'])
      .andWhere('user.id = :oid', { oid: id })
      .orderBy('expense.createdAt', 'DESC')
      .getMany()).map(e => new Expense(e));
  }

  async create(session: User, input: CreateExpenseDto): Promise<Expense> {
    if (!input.category || !input.purse || !input.value) {
      throw new BadRequestException("Incorrect input");
    }

    const user = await this.usersService.findOne(session.id);
    if (!user) {
      throw new BadRequestException("Incorrect user");
    }

    const purse = await this.purseService.findOne(session, input.purse);
    if (!purse) {
      throw new BadRequestException("Incorrect purse");
    }

    const envelope = input.envelope && await this.envelopeService.findOne(session, input.envelope);
    const pocket = input.pocket && await this.pocketService.findOne(input.pocket);

    if (!pocket && !envelope) {
      throw new BadRequestException("Incorrect container");
    }
    if (pocket && envelope) {
      throw new BadRequestException("Incorrect container");
    }

    if (pocket && pocket.factValue < input.value) {
      throw new BadRequestException("Not enough funds");
    }
    if (envelope && envelope.factValue < input.value) {
      throw new BadRequestException("Not enough funds");
    }

    return new Expense(await this.repository.save(new Expense({
      category: input.category,
      value: input.value,
      purse, pocket, envelope
    })));
  }
}

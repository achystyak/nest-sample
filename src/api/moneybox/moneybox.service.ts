import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnvelopeService } from '../envelope/envelope.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateMoneyboxDto } from './dto/create-moneybox.dto';
import { UpdateMoneyboxDto } from './dto/update-moneybox.dto';
import { Moneybox } from './moneybox.entity';

@Injectable()
export class MoneyboxService {

  constructor(
    @InjectRepository(Moneybox) private repository: Repository<Moneybox>,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    @Inject(forwardRef(() => EnvelopeService)) private readonly envelopeService: EnvelopeService,
  ) { }

  async findOne(session: User, id: string): Promise<Moneybox> {
    const moneybox = await this.repository
      .createQueryBuilder('moneybox')
      .leftJoin('moneybox.user', 'user')
      .select(['moneybox', 'user'])
      .andWhere('moneybox.id = :oid', { oid: id })
      .getOne();

    if (moneybox) {
      moneybox.envelopes = await this.envelopeService.findByMoneybox(session, moneybox.id);
      return new Moneybox(moneybox);
    }
  }

  async findByUser(session: User): Promise<Moneybox[]> {
    const moneyboxes = await this.repository
      .createQueryBuilder('moneybox')
      .leftJoin('moneybox.user', 'user')
      .select(['moneybox', 'user'])
      .andWhere('user.id = :oid', { oid: session.id })
      .orderBy('moneybox.createdAt', 'DESC')
      .getMany();

    for (const moneybox of moneyboxes) {
      moneybox.envelopes = await this.envelopeService.findByMoneybox(session, moneybox.id);
    }
    return moneyboxes.map(e => new Moneybox(e));
  }

  async create(session: User, input: CreateMoneyboxDto): Promise<Moneybox> {
    const user = await this.usersService.findOne(session.id);
    if (!user) {
      throw new BadRequestException("Incorrect user");
    }
    if (!input.name) {
      throw new BadRequestException("Incorrect input");
    }
    return new Moneybox(await this.repository.save(new Moneybox({
      name: input.name,
      expectedDate: input.expectedDate,
      user
    })));
  }
}

import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnvelopeService } from '../envelope/envelope.service';
import { CreatePocketDto } from '../pocket/dto/create-pocket.dto';
import { Pocket } from '../pocket/pocket.entity';
import { PurseService } from '../purse/purse.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PocketService {
  constructor(
    @InjectRepository(Pocket) private repository: Repository<Pocket>,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    @Inject(forwardRef(() => PurseService)) private readonly purseService: PurseService,
    @Inject(forwardRef(() => EnvelopeService)) private readonly envelopeService: EnvelopeService,
  ) { }

  async findOne(id: string): Promise<Pocket> {
    return new Pocket(await this.repository
      .createQueryBuilder('pocket')
      .leftJoin('pocket.expenses', 'expense')
      .select(['pocket', 'expense'])
      .andWhere('pocket.id = :oid', { oid: id })
      .getOne());
  }

  async findByEnvelope(session: User, id: string): Promise<Pocket[]> {
    const pockets = (await this.repository
      .createQueryBuilder('pocket')
      .leftJoin('pocket.expenses', 'expense')
      .leftJoin('pocket.envelope', 'envelope')
      .leftJoin('envelope.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .select(['pocket', 'expense'])
      .andWhere('envelope.id = :oid', { oid: id })
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('pocket.createdAt', 'DESC')
      .getMany()).map(e => new Pocket(e));

    return pockets;
  }

  async findByPurse(session: User, id: string): Promise<Pocket[]> {
    return (await this.repository
      .createQueryBuilder('pocket')
      .leftJoin('pocket.expenses', 'expense')
      .leftJoin('pocket.envelope', 'envelope')
      .leftJoin('envelope.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .select(['pocket', 'expense'])
      .andWhere('purse.id = :oid', { oid: id })
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('pocket.createdAt', 'DESC')
      .getMany()).map(e => new Pocket(e));
  }

  async findByUser(session: User): Promise<Pocket[]> {
    return (await this.repository
      .createQueryBuilder('pocket')
      .leftJoin('pocket.envelope', 'envelope')
      .leftJoin('envelope.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .leftJoin('pocket.expenses', 'expense')
      .select(['expense', 'pocket'])
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('pocket.createdAt', 'DESC')
      .getMany()).map(e => new Pocket(e));
  }

  async create(session: User, input: CreatePocketDto): Promise<Pocket[]> {
    if (!input.purse || !input.envelope) {
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

    const envelope = await this.envelopeService.findOne(session, input.envelope);
    if (!envelope) {
      throw new BadRequestException("Incorrect envelope");
    }

    let expense = 0;
    const pockets = input.values.map(value => {
      if (!value.name || !value.value) {
        throw new BadRequestException("Incorrect input");
      }
      expense += value.value;
      return new Pocket({
        name: value.name,
        initialValue: value.value,
        purse,
        envelope
      });
    });

    if (expense > envelope.factValue) {
      throw new BadRequestException("Not enough funds");
    }

    if (!(await this.envelopeService.writeOff(envelope, expense))) {
      throw new BadRequestException("Writing off failed");
    }

    return (await this.repository.save(pockets)).map(e => new Pocket(e));;
  }
}

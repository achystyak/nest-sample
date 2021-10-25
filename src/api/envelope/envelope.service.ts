import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PocketService } from '../pocket/pocket.service';
import { PurseService } from '../purse/purse.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateEnvelopeDto } from './dto/create-envelope.dto';
import { UpdateEnvelopeDto } from './dto/update-envelope.dto';
import { Envelope } from './envelope.entity';

@Injectable()
export class EnvelopeService {

  constructor(
    @InjectRepository(Envelope) private repository: Repository<Envelope>,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    @Inject(forwardRef(() => PurseService)) private readonly purseService: PurseService,
    @Inject(forwardRef(() => PocketService)) private readonly pocketService: PocketService,
  ) { }

  async findOne(session: User, id: string): Promise<Envelope> {
    const envelope = await this.repository
      .createQueryBuilder('envelope')
      .leftJoin('envelope.expenses', 'expense')
      .select(['envelope', 'expense'])
      .andWhere('purse.id = :oid', { oid: id })
      .getOne();

    if (envelope) {
      envelope.pockets = await this.pocketService.findByEnvelope(session, envelope.id);
      return new Envelope(envelope);
    }
  }

  async findByPurse(session: User, id: string): Promise<Envelope[]> {
    const envelopes = await this.repository
      .createQueryBuilder('envelope')
      .leftJoin('envelope.expenses', 'expense')
      .leftJoin('envelope.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .select(['envelope', 'purse', 'expense'])
      .andWhere('purse.id = :oid', { oid: id })
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('envelope.createdAt', 'DESC')
      .getMany();

    for (const envelope of envelopes) {
      envelope.pockets = await this.pocketService.findByEnvelope(session, envelope.id);
    }
    return envelopes.map(e => new Envelope(e));
  }

  async findByMoneybox(session: User, id: string): Promise<Envelope[]> {
    const envelopes = await this.repository
      .createQueryBuilder('envelope')
      .leftJoin('envelope.expenses', 'expense')
      .leftJoin('envelope.moneybox', 'moneybox')
      .leftJoin('moneybox.user', 'user')
      .select(['envelope', 'expense', 'moneybox'])
      .andWhere('moneybox.id = :oid', { oid: id })
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('envelope.createdAt', 'DESC')
      .getMany();

    for (const envelope of envelopes) {
      envelope.pockets = await this.pocketService.findByEnvelope(session, envelope.id);
    }
    return envelopes.map(e => new Envelope(e));
  }

  async findByUser(session: User): Promise<Envelope[]> {
    const envelopes = await this.repository
      .createQueryBuilder('envelope')
      .leftJoin('envelope.pockets', 'pocket')
      .leftJoin('envelope.expenses', 'expense')
      .leftJoin('envelope.purse', 'purse')
      .leftJoin('purse.user', 'user')
      .select(['envelope', 'purse', 'expense', 'pocket'])
      .andWhere('user.id = :userId', { userId: session.id })
      .orderBy('envelope.createdAt', 'DESC')
      .getMany();

    for (const envelope of envelopes) {
      envelope.pockets = await this.pocketService.findByEnvelope(session, envelope.id);
    }
    return envelopes.map(e => new Envelope(e));
  }

  async create(session: User, input: CreateEnvelopeDto): Promise<Envelope> {
    if (!input.name || !input.purse || !input.value) {
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
    const moneybox = input.moneybox &&
      await this.purseService.findOne(session, input.moneybox);

    return new Envelope(await this.repository.save(new Envelope({
      name: input.name,
      initialValue: input.value,
      purse,
      moneybox
    })));
  }

  async writeOff(envelope: Envelope, value: number) {
    return await (await this.repository.update(envelope, { initialValue: envelope.initialValue - value })).affected
  }
}

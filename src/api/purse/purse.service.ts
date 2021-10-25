import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnvelopeService } from '../envelope/envelope.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreatePurseDto } from './dto/purse.dto';
import { Purse } from './purse.entity';

@Injectable()
export class PurseService {

  constructor(
    @InjectRepository(Purse) private repository: Repository<Purse>,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    @Inject(forwardRef(() => EnvelopeService)) private readonly envelopeService: EnvelopeService,
  ) { }

  async findOne(session: User, id: string): Promise<Purse> {
    const purse = await this.repository
      .createQueryBuilder('purse')
      .andWhere('purse.id = :oid', { oid: id })
      .getOne();

    if (purse) {
      purse.envelopes = await this.envelopeService.findByPurse(session, purse.id);
      return new Purse(purse);
    }
  }

  async findByUser(session: User): Promise<Purse[]> {
    const purses = await this.repository
      .createQueryBuilder('purse')
      .leftJoin('purse.user', 'user')
      .select(['purse'])
      .andWhere('user.id = :oid', { oid: session.id })
      .orderBy('purse.createdAt', 'DESC')
      .getMany();

    for (const purse of purses) {
      purse.envelopes = await this.envelopeService.findByPurse(session, purse.id);
    }
    return purses.map(e => new Purse(e));
  }

  async create(session: User, input: CreatePurseDto): Promise<Purse> {

    if (!input.name || !input.value) {
      throw new BadRequestException("Incorrect input");
    }

    const user = await this.usersService.findOne(session.id);
    if (!user) {
      throw new BadRequestException("Incorrect user");
    }

    return new Purse(await this.repository.save(new Purse({
      name: input.name,
      initialValue: input.value,
      user
    })));
  }
}

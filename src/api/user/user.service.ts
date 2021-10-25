import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurseService } from '../purse/purse.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(forwardRef(() => PurseService)) private readonly purseService: PurseService,
  ) { }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findByCreds(email: string, password: string): Promise<User> {
    return await this.usersRepository.findOne({ email, password });
  }

  async findByRoom(roomId: string): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.rooms', 'room')
      .andWhere('room.id = :oid', { oid: roomId })
      .getMany();
  }

  async create(input: CreateUserDto): Promise<User> {
    const user = User.create(input);
    if (!user) {
      throw new BadRequestException('Invalid input');
    }
    return await this.usersRepository.save(user);
  }
}

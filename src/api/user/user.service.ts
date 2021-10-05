import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findByCreds(email: string, password: string): Promise<User> {
    return await this.usersRepository.findOne({ email, password });
  }

  async create(input: CreateUserDto): Promise<User> {
    const user = User.create(input);
    if (!user) {
      throw new BadRequestException('Invalid input');
    }
    return await this.usersRepository.save(user);
  }

  async update(id: string, input: UpdateUserDto): Promise<User> {
    const entity = await this.findOne(id);
    const user = entity && User.update(entity, input);
    if (!user) {
      throw new BadRequestException('Invalid input');
    }
    return await this.usersRepository.create(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('Invalid input');
    }
    return await this.usersRepository.remove(user);
  }
}

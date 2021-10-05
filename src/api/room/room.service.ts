import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../message/message.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {

  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
  ) { }

  async create(session: User, input: CreateRoomDto) {
    const author = await this.usersService.findOne(session.id)
    if (!author) {
      throw new BadRequestException("Author not found")
    }
    const users = [author];
    for (const userId of input.users ?? []) {
      const user = await this.usersService.findOne(userId)
      if (!user) {
        throw new BadRequestException("User not found")
      }
      users.push(user)
    }
    if (users.length < 2) {
      throw new BadRequestException("Not enough users")
    }
    const room = Room.create(author, input.title ?? "New Room", users)
    return await this.roomRepository.save(room)
  }

  async findOne(id: string) {
    return await this.roomRepository.findOne(id)
  }

  async messages(session: User, id: string) {
    const rooms = await this.findByUser(session.id);
    if (!rooms.some(r => r.id == id)) {
      throw new BadRequestException("Incorrect room");
    }
    return await this.messageService.findByRoom(id);
  }

  async findByUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    return user && this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'user')
      .where('user.id = :id', { id: user.id })
      .getMany();
  }
}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    return 'This action adds a new room';
  }

  async findOne(id: string) {
    return await this.roomRepository.findOne(id)
  }
}

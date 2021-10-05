import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';
import { RoomService } from '../room/room.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    @Inject(forwardRef(() => RoomService)) private readonly roomService: RoomService,
  ) { }

  async create(session: User, input: CreateMessageDto) {
    return 'This action adds a new message';
  }
}

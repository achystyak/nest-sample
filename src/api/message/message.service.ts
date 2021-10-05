import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
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

  async findByRoom(roomId: string): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .andWhere('room.id = :id', { id: roomId })
      .orderBy('message.createdAt', 'DESC')
      .skip(0).limit(300).getMany();
  }

  async create(session: User, data: CreateMessageDto[]): Promise<Message[]> {
    const user = await this.usersService.findOne(session.id);
    if (!user) {
      throw new BadRequestException("Incorrect user");
    }
    const rooms = await this.roomService.findByUser(user.id);
    const messages = [];

    for (const input of data) {
      if (!rooms.some(room => room.id == input.room)) {
        throw new BadRequestException("Incorrect Room");
      }
      if (!input.title?.length) {
        throw new BadRequestException("Incorrect input");
      }
    }

    for (const input of data) {
      const room = await this.roomService.findOne(input.room);
      const message = new Message({ text: input.title, user, room })
      const entity = await this.messageRepository.save(message)
      if (entity) {
        messages.push(entity);
      }
    }
    return messages;
  }
}

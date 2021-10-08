import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublisherGateway } from '../publisher/publisher.gateway';
import { Room } from '../room/entities/room.entity';
import { RoomService } from '../room/room.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
    @Inject(forwardRef(() => RoomService)) private readonly roomService: RoomService,
    @Inject(forwardRef(() => PublisherGateway)) private readonly pub: PublisherGateway,
  ) { }

  async findByRoom(roomId: string): Promise<Message[]> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .leftJoin('message.user', 'user')
      .select(['message', 'user'])
      .andWhere('room.id = :id', { id: roomId })
      .orderBy('message.createdAt', 'DESC')
      .skip(0).limit(300).getMany();
  }

  async create(session: User, data: CreateMessageDto[]): Promise<Message[]> {
    const user = await this.usersService.findOne(session.id);
    if (!user) {
      throw new BadRequestException("Incorrect user");
    }
    const userRooms = await this.roomService.findByUser(user.id);
    const rooms: Room[] = [];
    const messages: Message[] = [];

    for (const input of data) {
      const room = userRooms.find(room => room.id == input.room)
      if (!room) {
        throw new BadRequestException("Incorrect Room");
      }
      if (!input.text?.length) {
        throw new BadRequestException("Incorrect input");
      }
      if (!rooms.includes(room)) {
        rooms.push(room)
      }
    }

    for (const input of data) {
      const room = await this.roomService.findOne(input.room);
      const message = new Message({ text: input.text, user, room })
      const entity = await this.messageRepository.save(message)
      if (entity) {
        messages.push(entity);
      }
    }

    for (const room of rooms) {
      const users = (
        await this.usersService.findByRoom(room.id)
      ).filter(user => user.id !== session.id);
      await this.pub.sendMessage("messages", users,
        JSON.stringify({
          room: room.id,
          action: "update"
        })
      );
    }

    return messages;
  }
}

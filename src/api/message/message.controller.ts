import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { RestSession } from 'src/common/common.decorators';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @RestSession() session: User,
    @Body() input: CreateMessageDto[]) {
    return this.messageService.create(session, input);
  }
}

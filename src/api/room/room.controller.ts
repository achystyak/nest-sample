import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, forwardRef, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserService } from '../user/user.service';
import { RestSession } from 'src/common/common.decorators';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    @Inject(forwardRef(() => UserService)) private readonly usersService: UserService,
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @RestSession() session: User,
    @Body() createRoomDto: CreateRoomDto
  ) {
    return this.roomService.create(session, createRoomDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }
}

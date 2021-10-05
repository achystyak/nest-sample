import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RestSession } from 'src/common/common.decorators';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get('find/:id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async currentUser(@RestSession() session: User) {
    return await this.userService.findOne(session.id);
  }

  @Get('/rooms')
  @UseGuards(AuthGuard('jwt'))
  async rooms(
    @RestSession() session: User
    ) {
    return await this.userService.rooms(session);
  }
}

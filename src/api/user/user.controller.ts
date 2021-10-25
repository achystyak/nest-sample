import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RestSession } from 'src/common/common.decorators';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async currentUser(@RestSession() session: User) {
    return await this.userService.findOne(session.id);
  }
}

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}

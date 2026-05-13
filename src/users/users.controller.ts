import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { UsersService } from './users.service';
import type {
  CreateUserDto,
} from './dto/create-user.dto';
import {
  createUserSchema,
} from './dto/create-user.dto'; 
import type {
  UpdateUserDto,
} from './dto/update-user.dto';
import {
  updateUserSchema,
} from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createUserSchema))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

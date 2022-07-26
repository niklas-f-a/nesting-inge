import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums/role-enum';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return await this.usersService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findById(id);
  }

  @Roles(Role.CLIENT, Role.WORKER)
  @Patch()
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Include som data');
    }
    return await this.usersService.update(req.user.sub, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<string> {
    return await this.usersService.deleteById(id);
  }
}

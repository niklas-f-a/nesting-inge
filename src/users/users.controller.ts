import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums/role-enum';
import { CreateUserDto } from './dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findById(@Param('id') id: number): Promise<User> {
    return this.usersService.findById(id);
  }
}

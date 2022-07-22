import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('auth/login')
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(dto);
  }

  @Get('me')
  getProfile(@Request() req): User {
    return req.user;
  }
}

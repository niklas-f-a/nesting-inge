import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    //bcrypt

    if (user && user.hashPassword === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(dto: LoginDto) {
    const payload = await this.validateUser(dto.email, dto.password);

    return { access_token: this.jwtService.sign(payload) };
  }
}

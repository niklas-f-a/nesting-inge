import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    const isMatch = bcrypt.compareSync(password, user.hashPassword);

    if (user && isMatch) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async login(dto: LoginDto) {
    const result = await this.validateUser(dto.email, dto.password);

    const payload = {
      sub: result._id,
      email: result.email,
      name: result.name,
      role: result.role,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}

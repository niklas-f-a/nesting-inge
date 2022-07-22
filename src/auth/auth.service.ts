import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const selectedField = '+hashPassword';
    const user = await this.usersService.findOneByEmail(email, selectedField);

    const isMatch = bcrypt.compareSync(password, user.hashPassword);

    if (user && isMatch) {
      return {
        sub: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }
    throw new UnauthorizedException();
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const result = await this.validateUser(dto.email, dto.password);

    return { access_token: this.jwtService.sign(result) };
  }
}

import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserDto } from './dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @UseGuards(RolesGuard)
  async create(dto: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(dto);
    newUser.save();

    return newUser;
  }

  async findOne(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
}

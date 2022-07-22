import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(dto);
    newUser.save();

    return newUser;
  }

  async findOneByEmail(email: string, selectedField?: string): Promise<User> {
    if (selectedField) {
      return await this.userModel.findOne({ email }).select(selectedField);
    }
    return await this.userModel.findOne({ email });
  }

  async findById(id: number): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}

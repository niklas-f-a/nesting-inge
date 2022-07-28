import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userModel.create(dto);
      newUser.save();
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOneByEmail(email: string, selectedField?: string): Promise<User> {
    let user: User;
    if (selectedField) {
      user = await this.userModel.findOne({ email }).select(selectedField);
    } else {
      user = await this.userModel.findOne({ email });
    }
    if (!user) {
      throw new NotFoundException('No such User');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('User not found');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findById(id).select('+hashPassword');
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (dto.email) {
        user.email = dto.email;
      }
      if (dto.name) {
        user.name = dto.name;
      }
      if (dto.password) {
        user.hashPassword = dto.password;
      }
      await user.save();

      return {
        sub: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteById(id: number): Promise<string> {
    try {
      const result = await this.userModel.deleteOne({ _id: id });
      if (result?.deletedCount > 0) {
        return 'User is no more';
      } else {
        throw new NotFoundException('User cannot be found');
      }
    } catch (error) {
      throw new NotFoundException('User cannot be found');
    }
  }
}

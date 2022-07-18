import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Test, TestDocument } from './schemas/test.schema';

@Injectable()
export class TestService {
  constructor(@InjectModel(Test.name) private testModel: Model<TestDocument>) {}
  async create() {
    const user = new this.testModel({ name: 'harry' });
    return user.save();
  }

  async findAll() {
    return await this.testModel.find().exec();
  }
}

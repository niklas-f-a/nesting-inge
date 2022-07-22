import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from '../../auth/enums/role-enum';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
  _id?: mongoose.Schema.Types.ObjectId;
  sub?: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.CLIENT,
  })
  role?: Role;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    select: false,
  })
  hashPassword?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

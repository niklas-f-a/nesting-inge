import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ROLES } from '../../auth/role-enum';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
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
    enum: ROLES,
    default: ROLES.CLIENT,
  })
  role?: ROLES;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  })
  hashPassword: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

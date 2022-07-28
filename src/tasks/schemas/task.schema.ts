import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TaskDocument = Task & mongoose.Document;

export interface Message {
  _id?: mongoose.Schema.Types.ObjectId;
  content: string;
  date?: Date;
  sender: string;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({
    type: String,
    required: true,
  })
  task: string;

  @Prop({ type: String })
  imageLink?: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  done: boolean;

  @Prop([
    {
      content: String,
      date: { type: String, default: Date.now() },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ])
  messages: Message[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  client: mongoose.Schema.Types.ObjectId | User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  worker: mongoose.Schema.Types.ObjectId | User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

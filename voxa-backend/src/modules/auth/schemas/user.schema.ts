import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop()
  image?: string;

  @Prop()
  username?: string;

  @Prop({ default: 'active' })
  status?: 'active' | 'banned';

  @Prop()
  about?: string;

  @Prop()
  dob?: string;

  @Prop()
  securityAnswer?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

@Schema({ timestamps: true })
export class FriendRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  from: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  to: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);

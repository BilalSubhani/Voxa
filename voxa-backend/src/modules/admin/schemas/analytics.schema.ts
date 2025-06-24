import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  newUsers: number;

  @Prop({ required: true })
  activeUsers: number;

  @Prop({ required: true })
  totalUsers: number;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);

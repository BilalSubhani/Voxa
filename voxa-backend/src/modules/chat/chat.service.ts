// src/modules/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async saveMessage(payload: {
    senderId: string;
    receiverId: string;
    content: string;
  }) {
    const message = new this.messageModel({
      sender: new Types.ObjectId(payload.senderId),
      receiver: new Types.ObjectId(payload.receiverId),
      content: payload.content,
    });

    return message.save();
  }

  async getMessages(user1: string, user2: string) {
    return this.messageModel
      .find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      })
      .sort({ createdAt: 1 }); // optional: ascending order
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { EncryptionUtil } from 'src/shared/utils/encryption.util';
import {
  FriendRequest,
  FriendRequestDocument,
} from '../friend-request/schemas/friend-request.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,

    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequestDocument>,

    private readonly encryptionUtil: EncryptionUtil,
  ) {}

  async areFriends(userA: string, userB: string): Promise<boolean> {
    const request = await this.friendRequestModel.findOne({
      $or: [
        { from: userA, to: userB, status: 'accepted' },
        { from: userB, to: userA, status: 'accepted' },
      ],
    });
    return !!request;
  }

  async saveMessage(
    sender: string,
    receiver: string,
    content: string,
  ): Promise<MessageDocument> {
    const areFriends = await this.areFriends(sender, receiver);
    if (!areFriends) {
      throw new Error('Users must be friends to chat');
    }

    const encrypted = this.encryptionUtil.encrypt(content);
    return this.messageModel.create({
      sender,
      receiver,
      content: encrypted,
    });
  }

  async getChatHistory(userA: string, userB: string): Promise<any[]> {
    const messages = await this.messageModel
      .find({
        $or: [
          { sender: userA, receiver: userB },
          { sender: userB, receiver: userA },
        ],
      })
      .sort({ createdAt: 1 });

    return messages.map((msg) => ({
      ...msg.toObject(),
      content: this.encryptionUtil.decrypt(msg.content),
    }));
  }

  async markMessagesAsRead(sender: string, receiver: string): Promise<void> {
    await this.messageModel.updateMany(
      { sender, receiver, isRead: false },
      { $set: { isRead: true } },
    );
  }
}

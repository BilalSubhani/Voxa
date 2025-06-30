import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { Model } from 'mongoose';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(userId: string, type: string, content: string) {
    const notification = await this.notificationModel.create({
      user: userId,
      type,
      content,
    });

    // Send real-time notification if user is online
    this.notificationGateway.sendNotification(userId, {
      type,
      content,
      createdAt: notification.createdAt,
    });

    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } },
    );
    return { message: 'Marked all as read' };
  }
}

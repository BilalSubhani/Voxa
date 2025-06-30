import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
} from './schemas/friend-request.schema';
import { Model } from 'mongoose';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequestDocument>,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async sendRequest(from: string, to: string) {
    if (from === to) throw new Error('Cannot send friend request to yourself');

    const existing = await this.friendRequestModel.findOne({
      from,
      to,
      status: 'pending',
    });

    if (existing) throw new Error('Friend request already sent');

    const request = await this.friendRequestModel.create({ from, to });

    await this.notificationService.create(
      to,
      'friend_request',
      'You have a new friend request',
    );
    this.notificationGateway.sendNotification(to, {
      type: 'friend_request',
      content: 'You have a new friend request',
    });

    return request;
  }

  async acceptRequest(id: string) {
    const request = await this.friendRequestModel.findByIdAndUpdate(
      id,
      { status: 'accepted' },
      { new: true },
    );

    if (request) {
      await this.notificationService.create(
        request.from.toString(),
        'friend_request_accepted',
        'Your friend request has been accepted',
      );
      this.notificationGateway.sendNotification(request.from.toString(), {
        type: 'friend_request_accepted',
        content: 'Your friend request has been accepted',
      });
    }

    return request;
  }

  async rejectRequest(id: string) {
    return this.friendRequestModel.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true },
    );
  }

  async getPendingRequests(userId: string) {
    return this.friendRequestModel
      .find({ to: userId, status: 'pending' })
      .populate('from', 'name username email image');
  }

  async getFriends(userId: string) {
    return this.friendRequestModel
      .find({
        $or: [{ from: userId }, { to: userId }],
        status: 'accepted',
      })
      .populate('from to', 'name username email image');
  }

  async areFriends(userA: string, userB: string): Promise<boolean> {
    const friendship = await this.friendRequestModel.findOne({
      $or: [
        { from: userA, to: userB },
        { from: userB, to: userA },
      ],
      status: 'accepted',
    });
    return !!friendship;
  }
}

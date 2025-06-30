import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
} from './schemas/friend-request.schema';
import { Model } from 'mongoose';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequestDocument>,
  ) {}

  async sendRequest(from: string, to: string) {
    if (from === to) throw new Error('Cannot send friend request to yourself');

    const existing = await this.friendRequestModel.findOne({
      from,
      to,
      status: 'pending',
    });

    if (existing) throw new Error('Friend request already sent');

    return this.friendRequestModel.create({ from, to });
  }

  async acceptRequest(id: string) {
    return this.friendRequestModel.findByIdAndUpdate(
      id,
      { status: 'accepted' },
      { new: true },
    );
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

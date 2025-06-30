import {
  Controller,
  Post,
  Patch,
  Param,
  Get,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { ResponseUtil } from '../../common/utils/response.util';

@UseGuards(JwtAuthGuard)
@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post(':toUserId')
  async sendRequest(@Param('toUserId') toUserId: string, @Req() req: Request) {
    const result = await this.friendRequestService.sendRequest(
      req.user['id'],
      toUserId,
    );
    return ResponseUtil.success('Friend request sent', result);
  }

  @Patch(':requestId/accept')
  async acceptRequest(@Param('requestId') requestId: string) {
    const result = await this.friendRequestService.acceptRequest(requestId);
    return ResponseUtil.success('Friend request accepted', result);
  }

  @Patch(':requestId/reject')
  async rejectRequest(@Param('requestId') requestId: string) {
    const result = await this.friendRequestService.rejectRequest(requestId);
    return ResponseUtil.success('Friend request rejected', result);
  }

  @Get('pending')
  async getPendingRequests(@Req() req: Request) {
    const results = await this.friendRequestService.getPendingRequests(
      req.user['id'],
    );
    return ResponseUtil.success('Pending requests', results);
  }

  @Get('friends')
  async getFriends(@Req() req: Request) {
    const results = await this.friendRequestService.getFriends(req.user['id']);
    return ResponseUtil.success('Friends list', results);
  }
}

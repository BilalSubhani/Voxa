import { Controller, Get, UseGuards, Req, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { ResponseUtil } from '../../common/utils/response.util';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(@Req() req: Request) {
    const data = await this.notificationService.getUserNotifications(
      req.user['id'],
    );
    return ResponseUtil.success('Fetched notifications', data);
  }

  @Patch('mark-read')
  async markAllAsRead(@Req() req: Request) {
    const result = await this.notificationService.markAllAsRead(req.user['id']);
    return ResponseUtil.success(result.message, {});
  }
}

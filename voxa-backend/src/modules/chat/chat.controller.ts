import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResponseUtil } from 'src/common/utils/response.util';
import { Request } from 'express';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history')
  async getChatHistory(@Req() req: Request, @Query('userId') userId: string) {
    if (!userId) {
      throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
    }

    const currentUserId = req.user['sub'];
    const history = await this.chatService.getChatHistory(
      currentUserId,
      userId,
    );
    return ResponseUtil.success('Chat history', history);
  }

  @Patch('mark-read')
  async markMessagesAsRead(
    @Req() req: Request,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
    }

    const currentUserId = req.user['sub'];
    await this.chatService.markMessagesAsRead(userId, currentUserId);
    return ResponseUtil.success('Messages marked as read', {});
  }
}

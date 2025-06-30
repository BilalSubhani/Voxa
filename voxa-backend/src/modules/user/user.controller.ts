import {
  Controller,
  Get,
  Patch,
  Delete,
  Query,
  Body,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseUtil } from '../../common/utils/response.util';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = await this.userService.getProfile(req.user['id']);
    return ResponseUtil.success('User profile', user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Req() req: Request, @Body() body: any) {
    const user = await this.userService.updateProfile(req.user['id'], body);
    return ResponseUtil.success('Profile updated', user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteProfile(@Req() req: Request) {
    await this.userService.deleteAccount(req.user['id']);
    return ResponseUtil.success('Account deleted', {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(@Req() req: Request, @Query('q') query: string) {
    const results = await this.userService.searchUsers(query, req.user['id']);
    return ResponseUtil.success('Search results', results);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.userService.resetPassword(dto);
    return ResponseUtil.success('Password reset successful', result);
  }
}

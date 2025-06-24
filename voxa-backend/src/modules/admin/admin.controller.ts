import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ResponseUtil } from '../../common/utils/response.util';

import { ResetAdminPasswordDto } from './dto/reset-admin-password.dto';

import { AnalyticsService } from './services/analytics.service';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.adminService.getAllUsers();
    return {
      status: 1,
      message: 'All users fetched successfully',
      data: users,
    };
  }

  @Patch('ban/:id')
  async banUser(@Param('id') id: string) {
    await this.adminService.updateUserStatus(id, 'banned');
    return {
      status: 1,
      message: 'User has been banned',
      data: null,
    };
  }

  @Patch('unban/:id')
  async unbanUser(@Param('id') id: string) {
    await this.adminService.updateUserStatus(id, 'active');
    return {
      status: 1,
      message: 'User has been unbanned',
      data: null,
    };
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAnalytics() {
    const result = await this.analyticsService.getAllAnalytics();
    return ResponseUtil.success('Analytics data', result);
  }

  @Patch('reset-password')
  async resetAdminPassword(@Body() dto: ResetAdminPasswordDto) {
    await this.adminService.resetAdminPassword(dto);
    return {
      status: 1,
      message: 'Admin password has been reset successfully',
      data: null,
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';

import { Analytics, AnalyticsDocument } from '../schemas/analytics.schema';
import { User, UserDocument } from '../../auth/schemas/user.schema';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(Analytics.name)
    private analyticsModel: Model<AnalyticsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Cron('30 11 * * 2') // Runs every Tuesday at 11:30 AM
  async handleCron() {
    const today = dayjs().format('YYYY-MM-DD');

    const newUsers = await this.userModel.countDocuments({
      role: 'user',
      createdAt: {
        $gte: new Date(`${today}T00:00:00Z`),
        $lte: new Date(`${today}T23:59:59Z`),
      },
    });

    const activeUsers = await this.userModel.countDocuments({
      role: 'user',
      status: 'active',
    });

    const totalUsers = await this.userModel.countDocuments({
      role: 'user',
    });

    await this.analyticsModel.create({
      date: today,
      newUsers,
      activeUsers,
      totalUsers,
    });

    this.logger.log(
      `✅ Analytics stored for ${today}: newUsers=${newUsers}, activeUsers=${activeUsers}, totalUsers=${totalUsers}`,
    );
  }

  async getAllAnalytics() {
    return this.analyticsModel.find().sort({ createdAt: -1 });
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Analytics, AnalyticsDocument } from './schemas/analytics.schema';
import * as bcrypt from 'bcryptjs';
import * as dayjs from 'dayjs';
import { ResetAdminPasswordDto } from './dto/reset-admin-password.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Analytics.name)
    private analyticsModel: Model<AnalyticsDocument>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel
      .find({ role: 'user' })
      .select('-password -securityAnswer');
  }

  async updateUserStatus(
    userId: string,
    status: 'active' | 'banned',
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== 'user') {
      throw new NotFoundException('User not found');
    }

    user.status = status;
    await user.save();
  }

  async resetAdminPassword(dto: ResetAdminPasswordDto): Promise<void> {
    const admin = await this.userModel.findOne({
      email: dto.email,
      role: 'admin',
    });
    if (!admin) throw new NotFoundException('Admin not found');

    if (admin.securityAnswer !== dto.securityAnswer) {
      throw new BadRequestException('Invalid security answer');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    admin.password = hashed;
    await admin.save();
  }
}

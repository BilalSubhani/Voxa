import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { HashUtil } from 'src/shared/utils/hash.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashUtil: HashUtil,
  ) {}

  async getProfile(userId: string) {
    return this.userModel.findById(userId).select('-password -securityAnswer');
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    return this.userModel
      .findByIdAndUpdate(userId, updates, { new: true })
      .select('-password -securityAnswer');
  }

  async deleteAccount(userId: string) {
    return this.userModel.findByIdAndDelete(userId);
  }

  async searchUsers(query: string, currentUserId: string) {
    return this.userModel
      .find({
        $and: [
          { _id: { $ne: currentUserId } },
          { status: 'active' },
          {
            $or: [
              { email: { $regex: query, $options: 'i' } },
              { username: { $regex: query, $options: 'i' } },
            ],
          },
        ],
      })
      .select('name username email image');
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
      role: 'user',
    });
    if (!user) {
      throw new AppException('User not found');
    }
    user.password = await HashUtil.hash(dto.newPassword);
    await user.save();
    return { email: user.email };
  }
}

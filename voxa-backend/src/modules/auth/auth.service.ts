import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

import { Otp, OtpDocument } from './schemas/otp.schema';

// DTOs
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

// Services
import { OtpService } from 'src/shared/otp/otp.service';
import { MailService } from 'src/shared/mail/mail.service';
import { AppException } from 'src/common/exceptions/app.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private otpService: OtpService,
    private mailService: MailService,
  ) {}

  async sendOtp(dto: SendOtpDto): Promise<{
    email: string;
    code: string;
    expiresAt: Date;
    emailSent: boolean;
  }> {
    const { code, expiresAt } = this.otpService.generateOtp();

    await this.otpModel.deleteMany({ email: dto.email, type: dto.type });

    await this.otpModel.create({
      email: dto.email,
      code,
      type: dto.type,
      expiresAt,
    });

    let emailSent = false;
    try {
      await this.mailService.sendOtpEmail(dto.email, code, dto.type);
      emailSent = true;
    } catch (error) {
      emailSent = false;
    }

    return { email: dto.email, code, expiresAt, emailSent };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ verified: boolean; reason?: string }> {
    const otpDoc = await this.otpModel.findOne({
      email: dto.email,
      code: dto.code,
      type: dto.type,
    });

    if (!otpDoc) {
      return { verified: false, reason: 'Invalid or expired OTP' };
    }
    if (this.otpService.isExpired(otpDoc.expiresAt)) {
      await otpDoc.deleteOne();
      return { verified: false, reason: 'OTP has expired' };
    }

    await otpDoc.deleteOne();
    return { verified: true };
  }
}

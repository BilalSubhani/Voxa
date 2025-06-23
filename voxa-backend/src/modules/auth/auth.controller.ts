import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResponseUtil } from 'src/common/utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    const result = await this.authService.sendOtp(dto);
    return ResponseUtil.success('OTP process result', result);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const result = await this.authService.verifyOtp(dto);
    if (result.verified) {
      return ResponseUtil.success('OTP verified successfully', result);
    } else {
      return ResponseUtil.error(result.reason || 'OTP verification failed');
    }
  }
}

import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
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

  @Post('register-user')
  async registerUser(@Body() dto: RegisterUserDto) {
    const result = await this.authService.registerUser(dto);
    return ResponseUtil.success('User registered successfully', result);
  }

  @Post('register-admin')
  async registerAdmin(@Body() dto: RegisterAdminDto) {
    const result = await this.authService.registerAdmin(dto);
    return ResponseUtil.success('Admin registered successfully', result);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return ResponseUtil.success('Login successful', result);
  }
}

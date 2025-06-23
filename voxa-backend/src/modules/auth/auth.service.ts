import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Schemas
import { Otp, OtpDocument } from './schemas/otp.schema';
import { User, UserDocument } from './schemas/user.schema';

// DTOs
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';

// Services
import { OtpService } from 'src/shared/otp/otp.service';
import { MailService } from 'src/shared/mail/mail.service';
import { JwtService } from 'src/shared/jwt/jwt.service';
import { AppException } from 'src/common/exceptions/app.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private otpService: OtpService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
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

  async verifyOtp(dto: VerifyOtpDto) {
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

  async registerUser(dto: RegisterUserDto) {
    const exists = await this.userModel.findOne({
      $or: [{ email: dto.email }, { username: dto.username }],
    });
    if (exists)
      throw new AppException('User already exists', HttpStatus.CONFLICT);

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      ...dto,
      password: hash,
      role: 'user',
    });
    await this.mailService.sendWelcomeEmail(dto.email, dto.name);

    const token = this.jwtService.sign({ id: user._id, role: user.role });
    return { token, user };
  }

  async registerAdmin(dto: RegisterAdminDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists)
      throw new AppException('Admin already exists', HttpStatus.CONFLICT);

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      ...dto,
      password: hash,
      role: 'admin',
    });
    await this.mailService.sendWelcomeEmail(dto.email, dto.name);

    const token = this.jwtService.sign({ id: user._id, role: user.role });
    return { token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user)
      throw new AppException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match)
      throw new AppException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    if (user.role === 'user' && user.status === 'banned') {
      throw new AppException('Your account is banned', HttpStatus.FORBIDDEN);
    }

    const token = this.jwtService.sign({ id: user._id, role: user.role });
    return { token, user };
  }
}

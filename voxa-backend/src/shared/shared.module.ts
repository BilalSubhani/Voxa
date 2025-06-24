import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

// Services
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { JwtService } from './jwt/jwt.service';
import { MailService } from './mail/mail.service';
import { OtpService } from './otp/otp.service';

import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    CloudinaryService,
    JwtService,
    MailService,
    OtpService,
    JwtStrategy,
  ],
  exports: [CloudinaryService, JwtService, MailService, OtpService, JwtModule],
})
export class SharedModule {}

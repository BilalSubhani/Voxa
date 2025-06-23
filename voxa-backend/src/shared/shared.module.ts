import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Services
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { JwtService } from './jwt/jwt.service';
import { MailService } from './mail/mail.service';
import { OtpService } from './otp/otp.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CloudinaryService, JwtService, MailService, OtpService],
  exports: [CloudinaryService, JwtService, MailService, OtpService, JwtModule],
})
export class SharedModule {}

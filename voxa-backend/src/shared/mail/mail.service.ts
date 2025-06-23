import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE') || false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendOtpEmail(email: string, otp: string, type: string): Promise<void> {
    const subject = this.getSubjectByType(type);
    const html = this.getOtpEmailTemplate(otp, type);
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: email,
        subject,
        html,
      });
      this.logger.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}:`, error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = this.getWelcomeEmailTemplate(name);
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: email,
        subject: 'Welcome to Voxa!',
        html,
      });
      this.logger.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
    }
  }

  private getSubjectByType(type: string): string {
    switch (type) {
      case 'registration':
        return 'Verify Your Account - Voxa';
      case 'password-reset':
        return 'Reset Your Password - Voxa';
      case 'email-verification':
        return 'Verify Your Email - Voxa';
      default:
        return 'Verification Code - Voxa';
    }
  }

  private getOtpEmailTemplate(otp: string, type: string): string {
    const action =
      type === 'registration'
        ? 'complete your registration'
        : type === 'password-reset'
          ? 'reset your password'
          : 'verify your email';
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verification Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Voxa</h1>
          </div>
          <h2 style="color: #333; text-align: center;">Verification Code</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hi there! Use the following verification code to ${action}:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: #007bff; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 3px;">
              ${otp}
            </span>
          </div>
          <p style="color: #666; font-size: 14px;">
            This code will expire in 5 minutes. If you didn't request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 Voxa. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Voxa</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Voxa</h1>
          </div>
          <h2 style="color: #333; text-align: center;">Welcome, ${name}! 🎉</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for joining Voxa! Your account has been successfully created and verified.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            You can now:
          </p>
          <ul style="color: #666; font-size: 16px; line-height: 1.8;">
            <li>Connect with friends and family</li>
            <li>Share your thoughts and experiences</li>
            <li>Discover new people and communities</li>
            <li>Stay connected with real-time messaging</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Get Started
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 Voxa. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;
  }
}

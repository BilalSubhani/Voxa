import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  private readonly expiryMinutes = 5;

  generateOtp(): { code: string; expiresAt: Date } {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + this.expiryMinutes * 60 * 1000);

    return { code, expiresAt };
  }

  isExpired(expiresAt: Date): boolean {
    return new Date() > new Date(expiresAt);
  }
}

import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionUtil {
  private readonly algorithm: string;
  private readonly key: Buffer;
  private readonly ivLength: number;

  constructor(private readonly configService: ConfigService) {
    this.algorithm = 'aes-256-cbc';
    this.key = Buffer.from(configService.get<string>('ENCRYPTION_KEY'), 'hex');
    this.ivLength = 16;
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(data: string): string {
    const [ivHex, encryptedText] = data.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

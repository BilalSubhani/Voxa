import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  sign(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): Record<string, any> {
    return this.jwtService.verify(token);
  }
}

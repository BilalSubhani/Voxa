import { IsEmail, IsString, IsIn } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;

  @IsIn(['register', 'reset'])
  type: 'register' | 'reset';
}

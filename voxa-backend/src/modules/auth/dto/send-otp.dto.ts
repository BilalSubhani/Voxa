import { IsEmail, IsIn } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  email: string;

  @IsIn(['register', 'reset'])
  type: 'register' | 'reset';
}

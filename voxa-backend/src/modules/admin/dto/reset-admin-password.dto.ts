import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetAdminPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  securityAnswer: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

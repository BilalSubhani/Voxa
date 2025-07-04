import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  message: string;
}

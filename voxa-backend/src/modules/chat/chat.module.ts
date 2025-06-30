import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

import { SharedModule } from 'src/shared/shared.module';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  FriendRequest,
  FriendRequestSchema,
} from '../friend-request/schemas/friend-request.schema';
import { EncryptionUtil } from 'src/shared/utils/encryption.util';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    SharedModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, EncryptionUtil],
})
export class ChatModule {}

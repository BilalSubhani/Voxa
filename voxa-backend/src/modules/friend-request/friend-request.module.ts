import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestSchema,
} from './schemas/friend-request.schema';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    NotificationModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}

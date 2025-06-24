import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Analytics, AnalyticsSchema } from './schemas/analytics.schema';
import { SharedModule } from 'src/shared/shared.module';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Analytics.name, schema: AnalyticsSchema },
    ]),
    SharedModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AnalyticsService],
})
export class AdminModule {}

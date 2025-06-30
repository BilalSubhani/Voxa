import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { SharedModule } from '../../shared/shared.module';
import { HashUtil } from '../../shared/utils/hash.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [UserService, HashUtil],
})
export class UserModule {}

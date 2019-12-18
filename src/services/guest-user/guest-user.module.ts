import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestUserSchema } from 'src/schema/guestUser.schema';
import { GuestUserService } from './guest-user.service';
import { GuestUserController } from 'src/controllers/guest-user/guest-user.controller';
import { IseService } from '../ise/ise.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'GuestUser', schema: GuestUserSchema }]),
    IseService
  ],

  exports: [GuestUserService],
  controllers: [GuestUserController],
  providers: [GuestUserService, IseService],
})
export class GuestUserModule {}

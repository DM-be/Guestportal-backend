import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from './user.schema';
import { UsersService } from './users.service';
import { UsersController } from './user/user.controller';


@Module({
    imports: [
      MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
      PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    ],
    exports: [UsersService],
    controllers: [UsersController],
    providers: [UsersService]
  })
  export class UsersModule {}
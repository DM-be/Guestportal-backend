import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EidGatewayModule } from './gateways/eid-gateway/eid-gateway.module';
import { IseService } from './services/ise/ise.service';
import { UsersModule } from './services/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './services/auth/auth.module';
import { ActiveDirectoryService } from './services/active-directory/active-directory.service';
import { AdController } from './controllers/ad/ad.controller';
import { GuestUserController } from './controllers/guest-user/guest-user.controller';
import { GuestUserModule } from './services/guest-user/guest-user.module';
import { GuestUserGateWayModule } from './gateways/guestUser-gateway/guest-user.module';
import { environment } from './environments/environment';

@Module({
  imports: [
    EidGatewayModule,
    UsersModule,
    MongooseModule.forRoot(`mongodb://${environment.mongo_ip_port}/db?replicaSet=rs0`,{ useNewUrlParser: true} ),
    AuthModule,
    GuestUserModule,
    GuestUserGateWayModule,
  ],
  controllers: [AppController, AdController, GuestUserController],
  providers: [
    EidGatewayModule,
    GuestUserGateWayModule,
    IseService,
    UsersModule,
    AuthModule,
    GuestUserModule,
    ActiveDirectoryService,
  ],
})
export class AppModule {}

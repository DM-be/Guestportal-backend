import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pkcs11Service } from './services/pkcs11/pkcs11.service';
import { EidGatewayModule } from './eid-gateway/eid-gateway.module';
import { EidGateway } from './eid-gateway/eid-gateway.gateway';
import { IseService } from './services/ise/ise.service';
import { UsersModule } from './services/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './services/auth/auth.module';
import { GuestUserService } from './services/guest-user/guest-user.service';
import { ActiveDirectoryService } from './services/active-directory/active-directory.service';
import { AdController } from './controllers/ad/ad.controller';
import { GuestUserController } from './controllers/guest-user/guest-user.controller';

@Module({
  imports: [
    EidGatewayModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost/authexample'),
    AuthModule,
  ],
  controllers: [AppController, AdController, GuestUserController],
  providers: [
    AppService,
    Pkcs11Service,
    EidGateway,
    IseService,
    UsersModule,
    AuthModule,
    GuestUserService,
    ActiveDirectoryService,
  ],
})
export class AppModule {}

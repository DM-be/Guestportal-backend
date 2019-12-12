import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pkcs11Service } from './services/pkcs11/pkcs11.service';
import { EidGatewayModule } from './eid-gateway/eid-gateway.module';
import { EidGateway } from './eid-gateway/eid-gateway.gateway';
import { IseService } from './services/ise/ise.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EidGatewayModule, UsersModule, MongooseModule.forRoot('mongodb://localhost/authexample'), AuthModule],
  controllers: [AppController],
  providers: [AppService, Pkcs11Service, EidGateway, IseService, UsersModule, AuthModule],
})
export class AppModule {}

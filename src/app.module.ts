import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Pkcs11Service } from './services/pkcs11/pkcs11.service';
import { EidGatewayModule } from './eid-gateway/eid-gateway.module';
import { TestService } from './services/test/test.service';
import { EidGateway } from './eid-gateway/eid-gateway.gateway';
import { IseService } from './services/ise/ise.service';

@Module({
  imports: [EidGatewayModule],
  controllers: [AppController],
  providers: [AppService, Pkcs11Service, TestService, EidGateway, IseService],
})
export class AppModule {}

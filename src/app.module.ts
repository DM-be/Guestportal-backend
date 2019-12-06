import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Pkcs11Service } from './services/pkcs11/pkcs11.service';
import { EidGatewayModule } from './eid-gateway/eid-gateway.module';
import { TestService } from './services/test/test.service';

@Module({
  imports: [EidGatewayModule],
  controllers: [AppController],
  providers: [AppService, Pkcs11Service, TestService],
})
export class AppModule {}

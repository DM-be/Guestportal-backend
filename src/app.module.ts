import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Pkcs11Service } from './services/pkcs11/pkcs11.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Pkcs11Service],
})
export class AppModule {}

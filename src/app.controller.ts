import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Pkcs11Service } from './services/pkcs11/pkcs11.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly pkcs11Service: Pkcs11Service) {}

  @Get()
  getHello(): any {
    console.log(this.pkcs11Service.readEidData());
  }
}

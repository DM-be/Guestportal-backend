import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Pkcs11Service } from './services/pkcs11/pkcs11.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly pkcs11Service: Pkcs11Service) {}

  @Get()
  async getHello(): Promise<void> {
   // console.log(this.pkcs11Service.readEidData());
   //await this.pkcs11Service.getEidUserFromReader();
   
  }
}

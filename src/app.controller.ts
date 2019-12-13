import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Pkcs11Service } from './services/pkcs11/pkcs11.service';
import { IseService } from './services/ise/ise.service';
import { GuestInfo } from './models/GuestInfo';
import { GuestUser } from './models/GuestUser';
import { GuestUserService } from './services/guest-user/guest-user.service';
import { CreateGuestUserDto } from './models/CreateGuestUserDto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pkcs11Service: Pkcs11Service,
    private iseService: IseService,
    private guestService: GuestUserService
  ) {}

  @Get()
  async getHello() {
    // console.log(this.pkcs11Service.readEidData());

    //await this.pkcs11Service.getEidUserFromReader();

    const guestInfo: GuestInfo = {
      enabled: true,
      password: "testPassword",


    }

   // this.guestService.generateToAndFromDate();
    


    try {
   //   let res = await this.iseService.createISEGuestUser(guestUserDto);
     // return res;
    } catch (error) {
      return error;
    }


    
   
  }


  @Post()
  async addGuestUser(@Body() createGuestUserDto: CreateGuestUserDto)
  {
    try {
      console.log(createGuestUserDto)
      await this.guestService.createGuestUser(createGuestUserDto);
      
    } catch (error) {
      console.log(error);
      
    }
  }

/*

curl --header "Content-Type: application/json" \
  --request POST \
  --data ' { \
    "username" : "dennis@test.com", \
    "name" : "dennis-nameparam", \ 
    "firstName" : "Dennis", \
    "surName" : "Contractor", \ 
    "password" : "5555",\
    "reasonForVisit": "testvisitreason", \
    "personBeingVisited": "tester" \
  http:localhost:3000

*/



}

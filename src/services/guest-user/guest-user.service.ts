import { Injectable } from '@nestjs/common';
import { IseService } from '../ise/ise.service';
import * as moment from 'moment';
import { CreateGuestUserDto } from 'src/models/CreateGuestUserDto';
import { GuestInfo } from 'src/models/GuestInfo';
import { GuestUser } from 'src/models/GuestUser';
import { IseGuestUserDto } from 'src/models/IseGuestUserDto';
import { GuestAccessInfo } from 'src/models/GuestAccessInfo';



@Injectable()
export class GuestUserService {

    private VALID_DAYS: number;
    
    constructor(private iseService: IseService)  {
        this.VALID_DAYS = 2;
    }

    public async createGuestUser(createGuestUserDto: CreateGuestUserDto) {
        const { password, firstName, surName , emailAddress} = createGuestUserDto;
        const guestInfo: GuestInfo = {
            firstName,
            enabled: true, // check if required
            password,
            lastName: surName,
            userName: emailAddress,
        }
        const guestUser: GuestUser = 
        {
            guestInfo, 
            id: "11111", // todo: generate random id
            name: "tesGuestUer",// todo: check reason for "name",
            guestAccessInfo: this.generateGuestAccessInfo()
        }
        const iseGuestUserDto: IseGuestUserDto = {
            GuestUser: guestUser
        }
        try {
            await this.iseService.createISEGuestUser(iseGuestUserDto)
        } catch (error) {
         console.log(`could not create Ise guest user ${error}`);
        }

    }

    private generateGuestAccessInfo(): GuestAccessInfo
    {
           
        const toDate = moment().add(this.VALID_DAYS, "day").format('MM/DD/YYYY HH:mm');
        const fromDate = moment().format('MM/DD/YYYY HH:mm');

        return {
            toDate,
            fromDate,
            location: "Brussels",
            validDays: this.VALID_DAYS
        };

        /*

              "fromDate" : "04/14/2020 16:49",
      "toDate" : "04/19/2020 23:59",
        */

    }
}

import { Injectable } from '@nestjs/common';
import { IseService } from '../ise/ise.service';
import * as moment from 'moment';



@Injectable()
export class GuestUserService {

    private VALID_DAYS: number;
    


    constructor(private iseService: IseService)  {
        this.VALID_DAYS = 2;
    }

    public createGuestUser() {

    }

    generateToAndFromDate(): Object
    {
      //  const currentDate = moment(moment().format()).add(1, 'D');
        
    
        const toDate = moment().add(this.VALID_DAYS, "day").format('MM/DD/YYYY HH:mm');
        const fromDate = moment().format('MM/DD/YYYY HH:mm');


        console.log(fromDate)


        console.log(toDate)




        /*

              "fromDate" : "04/14/2020 16:49",
      "toDate" : "04/19/2020 23:59",
        */

        return {
            toDate: "",
            fromDate: ""
        }
    }
}

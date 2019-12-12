import { Injectable } from '@nestjs/common';
import { IseService } from '../ise/ise.service';
import { Moment } from 'moment';




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

           
        

        return {
            toDate: "",
            fromDate: ""
        }
    }
}

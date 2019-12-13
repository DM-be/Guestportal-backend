import { Injectable } from '@nestjs/common';
import { IseService } from '../ise/ise.service';
import * as moment from 'moment';
import { CreateGuestUserDto } from 'src/models/CreateGuestUserDto';
import { GuestInfo } from 'src/models/GuestInfo';
import { GuestUser } from 'src/models/GuestUser';
import { IseGuestUserDto } from 'src/models/IseGuestUserDto';
import { GuestAccessInfo } from 'src/models/GuestAccessInfo';

const LOCATION = 'Brussels';

@Injectable()
export class GuestUserService {
  private VALID_DAYS: number;

  constructor(private iseService: IseService) {
    this.VALID_DAYS = 2;
  }

  public async createGuestUser(createGuestUserDto: CreateGuestUserDto) {
    const {
      password,
      firstName,
      surName,
      emailAddress,
      personBeingVisited,
      reasonForVisit,
    } = createGuestUserDto;
    const guestInfo: GuestInfo = {
      firstName,
      enabled: true, // check if required
      password,
      lastName: surName,
      userName: emailAddress,
      emailAddress,
      // check if creation time is autogenerated
    };
    const guestUser: GuestUser = {
      guestInfo,
      id: '11111', // todo: generate random id
      name: 'tesGuestUer', // todo: check reason for "name",
      guestAccessInfo: this.generateGuestAccessInfo(),
      personBeingVisited,
      reasonForVisit,
    };
    const iseGuestUserDto: IseGuestUserDto = {
      GuestUser: guestUser,
    };
    try {
      await this.iseService.createISEGuestUser(iseGuestUserDto);
    } catch (error) {
      console.log(`could not create Ise guest user ${error}`);
    }
  }

  private generateGuestAccessInfo(): GuestAccessInfo {
    const toDate = moment()
      .add(this.VALID_DAYS, 'day')
      .format('DD/MM/YYYY HH:mm');
    const fromDate = moment().format('DD/MM/YYYY HH:mm');
    return {
      toDate,
      fromDate,
      location: LOCATION,
      validDays: this.VALID_DAYS,
    } as GuestAccessInfo;
  }
}

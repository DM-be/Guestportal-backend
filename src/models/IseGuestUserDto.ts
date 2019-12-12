import { GuestInfo } from './GuestInfo';
import { GuestAccessInfo } from './GuestAccessInfo';
import { GuestUser } from './GuestUser';

export interface IseGuestUserDto {
  GuestUser: GuestUser;
}

/*
{
  "GuestUser" : {
    "guestType" : "Weekly (default)",
    "guestInfo" : {
      "userName" : "testGST01",
      "firstName" : "John",
      "lastName" : "Smith",
      "password" : "9048"
    },
    "guestAccessInfo" : {
      "validDays" : 6,
      "fromDate" : "04/14/2020 16:49",
      "toDate" : "04/19/2020 23:59",
      "location" : "San Jose"
    },
    "portalId" : "f10871e0-7159-11e7-a355-005056aba474"
  }
}
   */

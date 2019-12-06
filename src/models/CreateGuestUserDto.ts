import { GuestInfo } from "./GuestInfo";
import { GuestAccesInfo } from "./GuestAccessInfo";


export interface CreateGuestUserDto {
    id: string,
    name: string,
    description: string,
    guestType: string,
    sponsorUsername: string,
    guestInfo: GuestInfo,
    guestAccessInfo: GuestAccesInfo,
    customFields?: Object
} 


/*

{

  "GuestUser" : {

    "id" : "123456789",

    "name" : "guestUser",

    "description" : "ERS Example user ",

    "guestType" : "Contractor",

    "sponsorUserName" : "Mr Spons",

    "guestInfo" : {

      "userName" : "DS3ewdsa34wWE",

      "emailAddress" : "email@some.uri.com",

      "phoneNumber" : "3211239034",

      "password" : "asdlkj324ew",

      "enabled" : true,

      "smsServiceProvider" : "GLobal Default"

    },

    "guestAccessInfo" : {

      "validDays" : 90,

      "fromDate" : "07/29/2014 14:44",

      "toDate" : "10/29/2014 17:30",

      "location" : "San Jose"

    },

    "portalId" : "23423432523",

    "customFields" : {

      "another key" : "and its value",

      "some key" : "some value"

    }

    */
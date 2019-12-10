import { GuestInfo } from "./GuestInfo";
import { GuestAccessInfo } from "./GuestAccessInfo";


export interface CreateGuestUserDto {
    name: string, // resource name
    id: string, // resource UUID --> "guestuserId" for deletebyid
    description?: string,
    customFields?: Object // key value map
    guestType?: string,
    status?: string,
    reasonForVisit?: string,
    personBeingVisited?: string,
    sponsorUsername?: string,
    sponsorUserId?: string,
    statusReason?: string,
    portalId?: string, // needed to send email? 
    guestAccessInfo?: GuestAccessInfo,
    guestInfo: GuestInfo,  
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
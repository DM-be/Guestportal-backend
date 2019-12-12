export interface GuestAccessInfo {
  validDays: number; // Default -1 --> number of guest days user is valid
  fromDate: string;
  toDate: string;
  location: string;
  ssid?: string;
  groupTag?: string;
}

/*
"guestAccessInfo" : {

      "validDays" : 90,

      "fromDate" : "07/29/2014 14:44",

      "toDate" : "10/29/2014 17:30",

      "location" : "San Jose"

    },

*/

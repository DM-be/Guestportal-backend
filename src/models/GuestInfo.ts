export interface GuestInfo {
  enabled: boolean; // default false --> this field is only for get operation not applicable for create/update operations
  password: string;
  emailAddress?: string;
  phoneNumber?: string;
  smsServiceProvider?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  creationTime?: string;
  notificationLanguage?: string;
}

/*

 "guestInfo" : {

      "userName" : "DS3ewdsa34wWE",

      "emailAddress" : "email@some.uri.com",

      "phoneNumber" : "3211239034",

      "password" : "asdlkj324ew",

      "enabled" : true,

      "smsServiceProvider" : "GLobal Default"

    },


    */

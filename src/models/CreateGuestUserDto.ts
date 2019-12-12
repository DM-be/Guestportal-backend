
// front end dto 

export interface CreateGuestUserDto { // name? --> 
    username: string;
    firstName: string; // multiple? --> first
    surName: string;
    emailAddress: string,
    password: string 
    reasonOfVisit?: string;
    visitee?: string;
}


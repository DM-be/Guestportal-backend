export interface GuestUserModel {
    userName: string; // ISE id
    firstName: string;
    lastName: string;
    fromDate: string;
    toDate: string;
    personBeingVisited: string;
    emailAddress: string;
    expire: Date;
}
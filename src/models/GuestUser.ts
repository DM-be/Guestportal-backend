import { GuestAccessInfo } from "./GuestAccessInfo";
import { GuestInfo } from "./GuestInfo";

export interface GuestUser {
    name: string; // resource name
    id: string; // resource UUID --> "guestuserId" for deletebyid
    description?: string;
    customFields?: Object; // key value map
    guestType?: string;
    status?: string;
    reasonForVisit?: string;
    personBeingVisited?: string;
    sponsorUsername?: string;
    sponsorUserId?: string;
    statusReason?: string;
    portalId?: string; // needed to send email?
    guestAccessInfo: GuestAccessInfo;
    guestInfo: GuestInfo;
}
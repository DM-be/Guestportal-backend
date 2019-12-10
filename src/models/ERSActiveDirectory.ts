import { ERSActiveDirectoryGroups } from "./ERSActiveDirectoryGroups";
import { ERSActiveDirectoryGroup } from "./ERSActiveDirectoryGroup";
import { AdAttributes } from "./AdAttributes";

export interface ERSActiveDirectory {
    name: string, // resource name
    id: string, // resource UUID
    description?: string,
    domain: string,
    adScopesNames?: string, // default: "Default_Scope" --> string that contains the names of the scopes that the directory belongs to. NAmes are separated by comma
    enableDomainWhiteList?: Boolean, // default true
    adGroups?: ERSActiveDirectoryGroups,
   // groups: ERSActiveDirectoryGroup [] // LIST of groups
    groupName?: string,
    firstName?: string,
    department?: string,
    lastName?: string,
    organizationalUnit?: string,
    jobTitle: string, 
    locality: string,
    email: string,
    stateOrProvince: string,
    telephone: string,
    country: string,
    streetAddress: string,
    schema: string,
    adAttributes: AdAttributes,
    adScopeNames: string







}
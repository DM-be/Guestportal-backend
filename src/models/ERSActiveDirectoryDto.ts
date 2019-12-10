export interface ERSActiveDirectoryDto {
    name: string, // resource name
    id: string, // resource UUID
    description?: string,
    domain: string,
    adScopesNames?: string, // default: "Default_Scope" --> string that contains the names of the scopes that the directory belongs to. NAmes are separated by comma
    enableDomainWhiteList?: Boolean, // 


}
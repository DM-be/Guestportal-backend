export class AxiosIseRequestHeader {

    private Content_Type: string;
    private Accept: string;

    public GUESTUSER = "identity.guestuser.2.0";

    constructor() {
        this["ERS-Media-Type"] = "";
        this.Content_Type = "application/json";
        this.Accept = "application/json";
    }

    public setMediaType(mediatype: string) {
        this["ERS-Media-Type"] = mediatype;
    }
}
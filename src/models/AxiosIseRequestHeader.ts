export class AxiosIseRequestHeader {

    private Content_Type: string;
    private Accept: string;

    constructor() {
        this["ERS-Media-Type"] = "";
        this.Content_Type = "application/json";
        this.Accept = "application/json";
    }

    public setMediaType(mediatype: string) {
        this["ERS-Media-Type"] = mediatype;
    }
}
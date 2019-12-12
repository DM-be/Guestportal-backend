import { Injectable } from '@nestjs/common';
import { CreateGuestUserDto } from 'src/models/CreateGuestUserDto';
import Axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosIseRequestHeader } from 'src/models/AxiosIseRequestHeader';
import { AxiosIseAuth } from 'src/models/AxiosIseAuth';


@Injectable()
export class IseService {

    private BASE_URL =  "https://172.21.106.51:9060/ers/config"
    private AXIOSISEAUTH: AxiosIseAuth = {
        username: "portaluser",
        password: "Vergeten123!"
    };
    

    public async createISEGuestUser(createGuestUserDto: CreateGuestUserDto): Promise<AxiosResponse> {
        try {
            const url = `${this.BASE_URL}/guestuser`;
            const headers = new AxiosIseRequestHeader();
            headers.setMediaType(headers.GUESTUSER);
            const axiosRequestConfig: AxiosRequestConfig = {
                auth: this.AXIOSISEAUTH,
                headers
            };
            return await Axios.post(url, createGuestUserDto, axiosRequestConfig);
        } catch (error) {
           const axiosError = error as AxiosError; // todo: handle other types of error
           if (axiosError.response.status === 400)
           {
               console.log(`could not create guest user, error: ${axiosError.response.statusText}`)
           } 
        }
    }

    public async deleteISEGuestUser(guestUserId: string): Promise<AxiosResponse> {
        try {
            const url = `${this.BASE_URL}/guestuser/${guestUserId}`;
            return await Axios.delete(url); // 204
        } catch (error) {
            const axiosError = error as AxiosError; // todo: handle other types of error
            if (axiosError.response.status === 400)
            {
                console.log(`could not delete guest user, error: ${axiosError.response.statusText}`)
            } 
        }
    }

    private async sendEmailWithCredentials(guestUserId: String, portalId: string): Promise<AxiosResponse> {
        try {
            const url = `${this.BASE_URL}/guestuser/email/${guestUserId}/portalId/${portalId}`;
            return await Axios.put(url);
        } catch (error) {
            const axiosError = error as AxiosError; // todo: handle other types of error
            if (axiosError.response.status === 400)
            {
                console.log(`could not send guest email, error: ${axiosError.response.statusText}`)
            } 
        }
    }

}

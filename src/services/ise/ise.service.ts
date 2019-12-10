import { Injectable } from '@nestjs/common';
import { CreateGuestUserDto } from 'src/models/CreateGuestUserDto';
import Axios, { AxiosResponse, AxiosError } from 'axios';



@Injectable()
export class IseService {

    private BASE_URL = "https://x:9060/ers/config"


    public async createISEGuestUser(createGuestUserDto: CreateGuestUserDto) {
        try {
            const url = `${this.BASE_URL}/guestuser`;
            await Axios.post(url, createGuestUserDto); //201
        } catch (error) {
           const axiosError = error as AxiosError; // todo: handle other types of error
           if (axiosError.response.status === 400)
           {
               console.log(`could not create guest user, error: ${axiosError.response.statusText}`)
           } 
        }
    }

    public async deleteISEGuestUser(guestUserId: string) {
        try {
            const url = `${this.BASE_URL}/guestuser/${guestUserId}`;
            await Axios.delete(url); // 204
        } catch (error) {
            const axiosError = error as AxiosError; // todo: handle other types of error
            if (axiosError.response.status === 400)
            {
                console.log(`could not delete guest user, error: ${axiosError.response.statusText}`)
            } 
        }
    }

}

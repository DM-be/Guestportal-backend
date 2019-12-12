import { Injectable } from '@nestjs/common';
import { IseGuestUserDto } from 'src/models/IseGuestUserDto';
import Axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosIseRequestHeader } from 'src/models/AxiosIseRequestHeader';
import { AxiosIseAuth } from 'src/models/AxiosIseAuth';

const PORTAL_ID = 'f10871e0-7159-11e7-a355-005056aba474';
const GUESTUSER = 'identity.guestuser.2.0';

@Injectable()
export class IseService {
  private BASE_URL = 'https://172.21.106.51:9060/ers/config';
  private AXIOSISEAUTH: AxiosIseAuth = {
    username: 'portaluser',
    password: 'Vergeten123!',
  };
  //todo: get values from vault in constructor/ docker-compose env

  public async createISEGuestUser(
    iseGuestUserDto: IseGuestUserDto,
  ): Promise<AxiosResponse> {
    try {
      const url = `${this.BASE_URL}/guestuser`;
      return await Axios.post(
        url,
        iseGuestUserDto,
        this.generateAxiosRequestConfig(GUESTUSER),
      );
    } catch (error) {
      const axiosError = error as AxiosError; // todo: handle other types of error
      if (axiosError.response.status === 400) {
        console.log(
          `could not create guest user, error: ${axiosError.response.statusText}`,
        );
      }
    }
  }

  public async deleteISEGuestUser(guestUserId: string): Promise<AxiosResponse> {
    try {
      const url = `${this.BASE_URL}/guestuser/${guestUserId}`;
      return await Axios.delete(url); // 204
    } catch (error) {
      const axiosError = error as AxiosError; // todo: handle other types of error
      if (axiosError.response.status === 400) {
        console.log(
          `could not delete guest user, error: ${axiosError.response.statusText}`,
        );
      }
    }
  }

  private async sendEmailWithCredentials(
    guestUserId: String,
  ): Promise<AxiosResponse> {
    try {
      const url = `${this.BASE_URL}/guestuser/email/${guestUserId}/portalId/${PORTAL_ID}`;
      return await Axios.put(url);
    } catch (error) {
      const axiosError = error as AxiosError; // todo: handle other types of error
      if (axiosError.response.status === 400) {
        console.log(
          `could not send guest email, error: ${axiosError.response.statusText}`,
        );
      }
    }
  }

  private generateAxiosRequestConfig(mediatype: string): AxiosRequestConfig {
    const headers = new AxiosIseRequestHeader();
    headers.setMediaType(mediatype);
    const axiosRequestConfig: AxiosRequestConfig = {
      auth: this.AXIOSISEAUTH,
      headers,
    };
    return axiosRequestConfig;
  }
}

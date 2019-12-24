import { Injectable } from '@nestjs/common';
import { IseGuestUserDto } from 'src/models/IseGuestUserDto';
import Axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosIseRequestHeader } from 'src/models/AxiosIseRequestHeader';
import { AxiosIseAuth } from 'src/models/AxiosIseAuth';
import { ActiveDirectoryUser } from 'src/models/ActiveDirectoryUser';
import * as https from 'https';

const PORTAL_ID = 'f10871e0-7159-11e7-a355-005056aba474';
const GUESTUSER = 'identity.guestuser.2.0';

@Injectable()
export class IseService {
  private BASE_URL = 'https://172.21.106.51:9060/ers/config';
  private AXIOSISEAUTH: AxiosIseAuth = {
    username: 'portaluser',
    password: 'Vergeten123!',
  };
  //TODO: get values from vault in constructor/ docker-compose env

  public async sendEmailWithCredentials(
    guestUserId: String,
  ): Promise<AxiosResponse> {
    try {
      const url = `${this.BASE_URL}/guestuser/email/${guestUserId}/portalId/${PORTAL_ID}`;
      return await Axios.put(url);
    } catch (error) {
      this.handleError(error, 'could not send email to guestuser');
    }
  }

  public async createISEGuestUser(
    iseGuestUserDto: IseGuestUserDto,
  ): Promise<AxiosResponse> {
    try {
      console.log(iseGuestUserDto);
      const url = `${this.BASE_URL}/guestuser`;
      return await Axios.post(
        url,
        iseGuestUserDto,
        this.generateAxiosRequestConfig(GUESTUSER),
      );
    } catch (error) {
      this.handleError(error, 'could not create create guestuser');
    }
  }

  public async deleteISEGuestUser(
    guestUserEmailAsId: string,
  ): Promise<AxiosResponse> {
    try {
      const url = `${this.BASE_URL}/guestuser/${guestUserEmailAsId}`;
      return await Axios.delete(url); // 204
    } catch (error) {
      this.handleError(error, 'could not create delete guestuser');
    }
  }

  // todo: implement API call
  public async getActiveDirectoryUsers(): Promise<ActiveDirectoryUser[]> {
    return new Promise(resolve => {
      resolve([
        {
          name: 'john smith',
        },
        {
          name: 'test name',
        },
        {
          name: 'test name',
        },
        {
          name: 'test name',
        },
        {
          name: 'test name',
        },
        {
          name: 'test name',
        },
        {
          name: 'test name',
        },
      ] as ActiveDirectoryUser[]);
    });
  }

  private generateAxiosRequestConfig(mediatype: string): AxiosRequestConfig {
    const headers = new AxiosIseRequestHeader();
    headers.setMediaType(mediatype);
    return {
      auth: this.AXIOSISEAUTH,
      headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, //TODO: implement SSL certification etc. (this is for testing!)
      }),
    } as AxiosRequestConfig;
  }

  private handleError(error: any, errorMessage: string) {
    const axiosError = error as AxiosError;
    if (axiosError.response.status === 400) {
      console.log(
        `${errorMessage}; errorStatusText: ${axiosError.response.statusText}`,
      );
    } else {
      console.log(`unknown error occured ${error}`);
    }
  }
}

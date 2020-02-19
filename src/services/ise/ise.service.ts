import { Injectable } from '@nestjs/common';
import { IseGuestUserDto } from 'src/models/IseGuestUserDto';
import Axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosIseRequestHeader } from 'src/models/AxiosIseRequestHeader';
import { AxiosIseAuth } from 'src/models/AxiosIseAuth';
import { ActiveDirectoryUser } from 'src/models/ActiveDirectoryUser';
import * as https from 'https';
import { environment } from 'src/environments/environment';
import { ERSResponse } from 'src/models/ERSResponse';

const PORTAL_ID = environment.portal; //'f10871e0-7159-11e7-a355-005056aba474';
const GUESTUSER = 'identity.guestuser.2.0';

/**
 * service responsible for communicating directly with the ISE API
 *
 * @export
 * @class IseService
 */
@Injectable()
export class IseService {
  private BASE_URL = 'https://172.21.106.51:9060/ers/config'; //'https://172.21.106.51:9060/ers/config';
  private AXIOSISEAUTH: AxiosIseAuth = {
    username: 'guestAPI',
    password: ' bO5D',
  };
  //TODO: get values from vault in constructor/ docker-compose env

  /**
   *sends an email with the valid credentials
   *
   * @param {String} guestUserId guestUserId (in the form of unique email address)
   * @returns {Promise<AxiosResponse>} Axios response containing status/data/...
   * @memberof IseService
   */
  public async sendEmailWithCredentials(
    guestUserId: String,
  ): Promise<AxiosResponse> {
    try {
      const url = `${this.BASE_URL}/guestuser/email/${guestUserId}/portalId/${PORTAL_ID}`;
      return await Axios.put(url);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * public function that creates a guest user on the ISE server
   *
   *
   * @param {IseGuestUserDto} iseGuestUserDto data transfer object used with parameters required for the ISE API
   * @returns {Promise<AxiosResponse>} Axios response containing status/data/...
   * @memberof IseService
   */
  public async createISEGuestUser(
    iseGuestUserDto: IseGuestUserDto,
  ): Promise<AxiosResponse> {
    try {
      // console.log(iseGuestUserDto);
      const url = `${this.BASE_URL}/guestuser/`;
      return await Axios.post(
        url,
        iseGuestUserDto,
        this.generateAxiosRequestConfig(GUESTUSER),
      );
    } catch (error) {
      console.log(error);
      this.handleError(error);
    }
  }

  /**
   *
   * public function that deletes a guest user from the ISE server
   *
   * @param {string} guestUserEmailAsId string containing the email address of the guest user, used to uniquely identify the user
   * @returns {Promise<AxiosResponse>} Axios response containing status/data/...
   * @memberof IseService
   */
  public async deleteISEGuestUser(
    guestUserEmailAsId: string,
  ): Promise<AxiosResponse> {
    try {
      const X = `${this.BASE_URL}/guestuser/name/${guestUserEmailAsId}`;
      const url = encodeURI(X);
      console.log(url)
      console.log('remove')
      return await Axios.delete(url, this.generateAxiosRequestConfig(GUESTUSER)); // 204
    } catch (error) {
      console.log(error);
      this.handleError(error);
    }
  }

  public async getAllGuestUsers(): Promise<any> {
    try {
      const url = `${this.BASE_URL}/guestuser/`;
      const axiosResponse = await Axios.get(
        url,
        this.generateAxiosRequestConfig(),
      );
      console.log('request finished');
      console.log(axiosResponse.data);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * helper function that creates an AxiosRequestConfig object
   * used by all Axios calls in this service
   * uses constants to set the mediaType of the header
   * @private
   * @param {string} mediatype required mediaType
   * @returns {AxiosRequestConfig} a valid AxiosRequestConfig used by Axios requests
   * @memberof IseService
   */
  private generateAxiosRequestConfig(mediatype?: string): AxiosRequestConfig {
    const headers = new AxiosIseRequestHeader();
    if (mediatype) {
      headers.setMediaType(mediatype);
    }
    return {
      auth: this.AXIOSISEAUTH,
      headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, //TODO: implement SSL certification etc. (this is for testing!)
      }),
    } as AxiosRequestConfig;
  }

  /**
   *
   * helper function to handle requests returned by API calls
   *
   * @private
   * @param {AxiosError} axiosError axios error object
   * @param {string} errorMessage the errormessage
   * @memberof IseService
   */
  private handleError(axiosError: AxiosError) {
    const resp = axiosError.response.data.ERSResponse as ERSResponse;
    console.log(resp.messages[0].title);
    console.log(axiosError.response.status)
    if (axiosError.response.status === 400) {
      const resp = axiosError.response.data.ERSResponse as ERSResponse;
      console.log(resp.messages[0].title);
    }
    else if(axiosError.response.status === 401)
    {
      console.log('unauthorized');
    } 
  }
}

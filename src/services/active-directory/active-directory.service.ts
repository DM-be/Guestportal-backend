import { Injectable } from '@nestjs/common';
import { ActiveDirectoryUser } from 'src/models/ActiveDirectoryUser';
import { IseService } from '../ise/ise.service';

/**
 * microservice responsible for (indirect) communication with the Active Directory
 *
 * @export
 * @class ActiveDirectoryService
 */
@Injectable()
export class ActiveDirectoryService {
  /**
   *Creates an instance of ActiveDirectoryService.
   * @param {IseService} iseService an instance of the IseService class (direct communication with ISE server)
   * @memberof ActiveDirectoryService
   */
  constructor(private iseService: IseService) {}

  /**
   * delegates a call to the IseService getActiveDirectoryUsers() to return AD users
   *
   * @returns {Promise< ActiveDirectoryUser[]>} 
   * Promise containing all Active Directory Users
   *  
   * @memberof ActiveDirectoryService
   */
  public async getListOfVisiteesFromActiveDirectory(): Promise<
    ActiveDirectoryUser[]
  > {
    try {
      return await this.iseService.getActiveDirectoryUsers();
    } catch (error) {}
  }
}

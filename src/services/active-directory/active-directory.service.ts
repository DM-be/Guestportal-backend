import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ActiveDirectoryUser } from 'src/models/ActiveDirectoryUser';
import * as ActiveDirectory from 'activedirectory';
import { ActiveDirectoryConfig } from 'src/models/ActiveDirectoryConfig';
const GROUP_NAME = 'werknemers'; // CN or DN

/**
 * microservice responsible for communication with the Active Directory using LDAP
 *
 * @export
 * @class ActiveDirectoryService
 */
@Injectable()
export class ActiveDirectoryService {
  /**
   * reference to the ActiveDirectory connection
   *
   * @private
   * @type {ActiveDirectory}
   * @memberof ActiveDirectoryService
   */
  private ad: ActiveDirectory;

  /**
   *Creates an instance of ActiveDirectoryService.
   * @memberof ActiveDirectoryService
   */
  constructor() {
    this.initializeActiveDirectory();
  }

  /**
   * initializes the ActiveDirectory reference using the activedirectory package and configurtion
   *
   * @private
   * @memberof ActiveDirectoryService
   */
  private initializeActiveDirectory(): void {
    const config: ActiveDirectoryConfig = {
      baseDN: '',
      password: '',
      url: '',
      username: '',
    };
    this.ad = new ActiveDirectory(config);
  }

  /**
   * retrieves a list of active directory users, using the constant group name and reference to the AD
   * casts the userObjects returned to the ActivedirectoryUser interface
   *
   * @returns {Promise<ActiveDirectoryUser[]>}
   * @memberof ActiveDirectoryService
   */
  public getUsersFromActiveDirectory(): Promise<ActiveDirectoryUser[]> {
    try {
      return new Promise((resolve, reject) => {
        this.ad.getUsersForGroup(GROUP_NAME, (err, userObjects: Object[]) => {
          if (err) {
            reject(err);
          }
          resolve(userObjects as ActiveDirectoryUser[]);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

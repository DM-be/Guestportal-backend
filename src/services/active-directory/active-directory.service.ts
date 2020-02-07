import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ActiveDirectoryUser } from 'src/models/ActiveDirectoryUser';
import * as ActiveDirectory from 'activedirectory';
import { ActiveDirectoryConfig } from 'src/models/ActiveDirectoryConfig';
const GROUP_NAME = 'werknemers'; // CN or DN
const BASE_DN = '';
const AD_USERNAME = '';
const AD_PASSWORD = '';
const AD_URL = '';

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
      baseDN: BASE_DN,
      password: AD_PASSWORD,
      url: AD_URL,
      username: AD_USERNAME,
      port: 1389
      
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
    return new Promise((resolve, reject) => {
      this.ad.getUsersForGroup(GROUP_NAME, (err, userObjects: Object[]) => {
        if (err) {
          reject(new InternalServerErrorException(err));
        }
        resolve(userObjects as ActiveDirectoryUser[]);
      });
    });
  }

  public async getUsersFromActiveDirectoryMock(): Promise<
    ActiveDirectoryUser[]
  > {
    return new Promise(resolve => {
      resolve([
        {
          name: 'john smith',
          email: 'johnsmit@test.com',
        },
        {
          name: 'random name',
          email: 'johnsmit@test.com',
        },
        {
          name: 'test name',
          email: 'johnsmit@test.com',
        },
        {
          name: 'test name',
          email: 'johnsmit@test.com',
        },
        {
          name: 'test name',
          email: 'johnsmit@test.com',
        },
        {
          name: 'test name',
          email: 'johnsmit@test.com',
        },
        {
          name: 'test name',
          email: 'johnsmit@test.com',
        },
      ] as ActiveDirectoryUser[]);
    });
  }
}

import { Controller, Get } from '@nestjs/common';
import { ActiveDirectoryService } from 'src/services/active-directory/active-directory.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ActiveDirectoryUser } from 'src/models/ActiveDirectoryUser';

/**
 * controller responsible for active directory integration
 * retrieves the active director users
 *
 * @export
 * @class AdController
 */
@ApiTags('Active Directory')
@Controller('ad')
export class AdController {
  /**
   *Creates an instance of AdController.
   * @param {ActiveDirectoryService} adService service communicating through LDAP to the AD server
   * @memberof AdController
   */
  constructor(private adService: ActiveDirectoryService) {}

  /**
   * uses the adService to return a promise with the active directory users
   *
   * @returns {Promise<ActiveDirectoryUser []>}
   * @memberof AdController
   */
  @ApiOkResponse({
    description: 'Retrieved active directory users succesfully',
  })
  @Get()
  public async getActiveDirectoryUsers(): Promise<ActiveDirectoryUser[]> {
    try {
      return await this.adService.getUsersFromActiveDirectory();
    } catch (error) {
      console.log(error);
    }
  }
}

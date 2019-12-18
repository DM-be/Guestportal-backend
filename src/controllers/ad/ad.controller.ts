import { Controller, Get } from '@nestjs/common';
import { ActiveDirectoryService } from 'src/services/active-directory/active-directory.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Active Directory')
@Controller('ad')
export class AdController {
  constructor(private adService: ActiveDirectoryService) {}

  @ApiOkResponse({
    description: 'Retrieved active directory users succesfully',
  })
  @Get()
  async getActiveDirectoryUsers() {
    try {
      return await this.adService.getListOfVisiteesFromActiveDirectory();
    } catch (error) {
      console.log('error', error);
    }
  }
}

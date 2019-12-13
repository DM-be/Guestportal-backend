import { Controller, Get } from '@nestjs/common';
import { ActiveDirectoryService } from 'src/services/active-directory/active-directory.service';

@Controller('ad')
export class AdController {

    constructor(private adService: ActiveDirectoryService) {

    }

    @Get() 
    async getActiveDirectoryUsers() {
        try {
            return await this.adService.getListOfVisiteesFromActiveDirectory();
        } catch (error) {
            console.log('error', error);
        }
    }


}

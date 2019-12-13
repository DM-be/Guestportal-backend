import { Injectable } from '@nestjs/common';
import { ActiveDirectoryUser } from 'src/models/ActiveDirectoryUser';

@Injectable()
export class ActiveDirectoryService {



    public async getListOfVisiteesFromActiveDirectory(): Promise<ActiveDirectoryUser []> {
        
        
    }
}

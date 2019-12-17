import { Injectable } from '@nestjs/common';
import { ActiveDirectoryUser } from 'src/models/ActiveDirectoryUser';
import { IseService } from '../ise/ise.service';

@Injectable()
export class ActiveDirectoryService {
  constructor(private iseService: IseService) {}

  public async getListOfVisiteesFromActiveDirectory(): Promise<
    ActiveDirectoryUser[]
  > {
    try {
      return await this.iseService.getActiveDirectoryUsers();
    } catch (error) {}
  }
}

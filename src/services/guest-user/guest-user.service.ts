import { Injectable } from '@nestjs/common';
import { IseService } from '../ise/ise.service';
import * as moment from 'moment';
import { CreateGuestUserDto } from 'src/models/CreateGuestUserDto.dto';
import { GuestInfo } from 'src/models/GuestInfo';
import { GuestUser } from 'src/models/GuestUser';
import { IseGuestUserDto } from 'src/models/IseGuestUserDto';
import { GuestAccessInfo } from 'src/models/GuestAccessInfo';
import { InjectModel } from '@nestjs/mongoose';
import { GuestUserModel } from 'src/models/GuestUserModel';
import { Model } from 'mongoose';
import { BehaviorSubject } from 'rxjs';
import { RemoveGuestUserDto } from 'src/models/RemoveGuestUserDto';

const LOCATION = 'Brussels';
const PORTAL_ID = 'f10871e0-7159-11e7-a355-005056aba474';
const GUEST_TYPE = 'Weekly (default)'; // TODO: check guest type
const MOMENT_FORMAT = 'MM/DD/YYYY HH:mm';
const DAY = 'day';

@Injectable()
export class GuestUserService {
  private VALID_DAYS: number;
  public guestUsers$: BehaviorSubject<GuestUserModel[]>;
  constructor(
    private iseService: IseService,
    @InjectModel('GuestUser') private guestUserModel: Model<GuestUserModel>,
  ) {
    this.guestUsers$ = new BehaviorSubject([]);
    this.VALID_DAYS = 2;
    this.initGuestUsers$();
    this.watchChangeStreamForDeletions();
  }

  public getGuestUsers$(): BehaviorSubject<GuestUserModel[]> {
    return this.guestUsers$;
  }

  private async initGuestUsers$() {
    try {
      this.guestUsers$ = new BehaviorSubject(await this.getAllGuestUsers());
      const users = await this.getAllGuestUsers();
      console.log(users);
    } catch (error) {
      console.log(error);
    }
  }

  private async watchChangeStreamForDeletions() {
    this.guestUserModel.watch().on('change', async changeEvent => {
      if (changeEvent.operationType === 'delete') {
        this.guestUsers$.next(await this.getAllGuestUsers());
      }
    });
  }

  public async createGuestUser(createGuestUserDto: CreateGuestUserDto) {
    const {
      password,
      firstName,
      surName,
      emailAddress,
      personBeingVisited,
      reasonForVisit,
    } = createGuestUserDto;

    const guestInfo: GuestInfo = this.generateGuestInfo(
      firstName,
      surName,
      password,
      emailAddress,
    );
    const guestUser: GuestUser = this.generateGuestUser(
      guestInfo,
      personBeingVisited,
      reasonForVisit,
    );
    const iseGuestUserDto: IseGuestUserDto = {
      GuestUser: guestUser,
    };
    try {
      //  await this.iseService.createISEGuestUser(iseGuestUserDto);
      const guestUserModel = this.createGuestUserModel(guestUser);
      await this.saveGuestUserModelToMongodb(guestUserModel);
      this.guestUsers$.next(
        this.addGuestUserModelToGuestUsers$(guestUserModel),
      );
    } catch (error) {
      console.log(error);
      console.log(`could not create Ise guest user ${error}`);
    }
  }

  public async removeGuestUser(removeGuestUserDto: RemoveGuestUserDto) {
    try {
      //await this.iseService.deleteISEGuestUser(removeGuestUserDto.emailAddress);
      await this.removeGuestUserModelFromGuestUsers$(
        removeGuestUserDto.emailAddress,
      );
      await this.deleteGuestUserModelFromMongodb(
        removeGuestUserDto.emailAddress,
      );
    } catch (error) {}
  }

  private addGuestUserModelToGuestUsers$(
    guestUserModel: GuestUserModel,
  ): GuestUserModel[] {
    try {
      const guestUserModels = this.guestUsers$.getValue();
      guestUserModels.push(guestUserModel);
      return guestUserModels;
    } catch (error) {
      console.log(error);
    }
  }

  private removeGuestUserModelFromGuestUsers$(emailAddress: string) {
    try {
      const guestUserModels = this.guestUsers$.getValue();
      const i = guestUserModels.findIndex(
        gu => gu.emailAddress === emailAddress,
      );
      guestUserModels.splice(i, 1);
      return guestUserModels;
    } catch (error) {
      console.log(error);
    }
  }

  private async getAllGuestUsers(): Promise<GuestUserModel[]> {
    return this.guestUserModel.find({}, (err, docs) => {
      return docs as GuestUserModel[];
    });
  }

  private async saveGuestUserModelToMongodb(
    guestUserModel: GuestUserModel,
  ): Promise<void> {
    try {
      await new this.guestUserModel(guestUserModel).save();
    } catch (error) {
      console.log(error);
    }
  }

  private async deleteGuestUserModelFromMongodb(
    emailAddress: string,
  ): Promise<void> {
    try {
      await this.guestUserModel.deleteOne({ emailAddress });
    } catch (error) {}
  }

  private createGuestUserModel(guestUser: GuestUser): GuestUserModel {
    try {
      const { personBeingVisited } = guestUser;
      const { fromDate, toDate } = guestUser.guestAccessInfo;
      const { emailAddress, firstName, lastName } = guestUser.guestInfo;
      return {
        emailAddress,
        firstName,
        lastName,
        fromDate,
        toDate,
        personBeingVisited,
        expire: moment() //TODO: remove test --> date with todate
          .add(1, 'm')
          .toDate(),
      } as GuestUserModel;
    } catch (error) {}
  }

  private generateGuestAccessInfo(): GuestAccessInfo {
    const toDate = moment()
      .add(this.VALID_DAYS, DAY)
      .format(MOMENT_FORMAT);
    const fromDate = moment().format(MOMENT_FORMAT);
    return {
      toDate,
      fromDate,
      location: LOCATION,
      validDays: this.VALID_DAYS + 1, // why + 1 day needed for ISE api??
    } as GuestAccessInfo;
  }

  private generateGuestInfo(
    firstName: string,
    surName: string,
    password: string,
    emailAddress: string,
  ): GuestInfo {
    const guestInfo: GuestInfo = {
      firstName,
      enabled: true, // TODO: check if this property is required
      password,
      lastName: surName,
      userName: emailAddress,
      emailAddress,
      // TODO: check generation Time property (autogenerated?)
    };
    return guestInfo;
  }

  private generateGuestUser(
    guestInfo: GuestInfo,
    personBeingVisited: string,
    reasonForVisit: string,
  ): GuestUser {
    const guestUser: GuestUser = {
      guestInfo,
      id: guestInfo.emailAddress, // TODO: implement ID generator (name, email,??)
      name: `${guestInfo.firstName} {${guestInfo.lastName}}`, // TODO: check reasoning for name property, still needed?
      guestAccessInfo: this.generateGuestAccessInfo(),
      personBeingVisited,
      reasonForVisit,
      portalId: PORTAL_ID,
      guestType: GUEST_TYPE,
    };
    return guestUser;
  }
}

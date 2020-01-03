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

//TODO: move to env
const LOCATION = 'Brussels';
const PORTAL_ID = 'f10871e0-7159-11e7-a355-005056aba474';
const GUEST_TYPE = 'Weekly (default)'; // TODO: check guest type
const MOMENT_FORMAT = 'MM/DD/YYYY HH:mm';
const DAY = 'day';

@Injectable()
/**
 * service responsible for creating guest users, removing them and notifying database changes.
 * Communicates with the IseService to send the requests to the ISE API.
 *
 * @export
 * @class GuestUserService
 */
export class GuestUserService {
  /**
   *
   * The number of days a user is allowed guest access in ISE.
   * @private
   * @type {number}
   * @memberof GuestUserService
   */
  private VALID_DAYS: number;

  /**
   * The subject containing an array of guest users. Emits all changes as a full new array of guest users.
   *
   * @type {BehaviorSubject<GuestUserModel[]>}
   * @memberof GuestUserService
   */
  public guestUsers$: BehaviorSubject<GuestUserModel[]>;

  /**
   *Creates an instance of GuestUserService.
   * @param {IseService} iseService IseService to communicate directly using exposed public functions for removing, deleting,...
   * @param {Model<GuestUserModel>} guestUserModel reference to the guest user model used by mongoose
   * @memberof GuestUserService
   */
  constructor(
    private iseService: IseService,
    @InjectModel('GuestUser') private guestUserModel: Model<GuestUserModel>,
  ) {
    this.guestUsers$ = new BehaviorSubject([]);
    this.VALID_DAYS = 2;
    this.initializeGuestUsers$();
    this.watchChangeStreamForDeletions();
  }

  /**
   * Public exposed function used by the guest user controller.
   * Uses the CreateGuestUserDto object to generate the IseGuestUserDto object for communication with the ISE API.
   * Creates a guestUsermodel
   *
   * @param {CreateGuestUserDto} createGuestUserDto
   * @returns {Promise<void>}
   * @memberof GuestUserService
   */
  public async createGuestUser(
    createGuestUserDto: CreateGuestUserDto,
  ): Promise<void> {
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
        this.addGuestUserModelToGuestUsers$Value(guestUserModel),
      );
    } catch (error) {
      console.log(error);
      console.log(`could not create Ise guest user ${error}`);
    }
  }

  /**
   *  Public exposed function used by the guest user controller.
   * Removes a guest user from the guest user mongodb and the ISE api.
   * Emits the value of the modified subject after removing the user sucessfully
   *
   * @param {RemoveGuestUserDto} removeGuestUserDto
   * @returns {Promise<void>}
   * @memberof GuestUserService
   */
  public async removeGuestUser(
    removeGuestUserDto: RemoveGuestUserDto,
  ): Promise<void> {
    try {
      //await this.iseService.deleteISEGuestUser(removeGuestUserDto.emailAddress);
      await this.deleteGuestUserModelFromMongodb(
        removeGuestUserDto.emailAddress,
      );
      this.guestUsers$.next(
        await this.removeGuestUserModelFromGuestUsers$Value(
          removeGuestUserDto.emailAddress,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * initializes the guestUsers$ subject
   * emits its first value as all current guest users in the mongodb.
   *
   * @private
   * @memberof GuestUserService
   */
  private async initializeGuestUsers$() {
    try {
      this.guestUsers$ = new BehaviorSubject(undefined);
      this.guestUsers$.next(await this.getAllGuestUserModelsFromdb());
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * listens to database changes, when a record is auto deleted it will emit the full guest users database, excluding the deleted record.
   *
   * @private
   * @memberof GuestUserService
   */
  private async watchChangeStreamForDeletions() {
    this.guestUserModel.watch().on('change', async changeEvent => {
      if (changeEvent.operationType === 'delete') {
        this.guestUsers$.next(await this.getAllGuestUserModelsFromdb());
      }
    });
  }

  /**
   * Adds a GuestUserModel using the current value of the guestUser$ subject.
   * Returns the modified array after adding the model.
   *
   * @private
   * @param {GuestUserModel} guestUserModel
   * @returns {GuestUserModel[]}
   * @memberof GuestUserService
   */
  private addGuestUserModelToGuestUsers$Value(
    guestUserModel: GuestUserModel,
  ): GuestUserModel[] {
    try {
      const guestUserModels = this.guestUsers$.getValue();
      console.log('add');
      guestUserModels.push(guestUserModel);
      return guestUserModels;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Removes a GuestUserModel from the current value of the guestUser$ value.
   * Returns the modified array after removing the model.
   *
   * @private
   * @param {string} emailAddress
   * @returns {GuestUserModel []}
   * @memberof GuestUserService
   */
  private removeGuestUserModelFromGuestUsers$Value(
    emailAddress: string,
  ): GuestUserModel[] {
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

  /**
   * Retrieves all guest user models from the mongodb.
   *
   * @private
   * @returns {Promise<GuestUserModel[]>} a promise containing an array of GuestUsermodels
   * @memberof GuestUserService
   */
  private async getAllGuestUserModelsFromdb(): Promise<GuestUserModel[]> {
    try {
      return await this.guestUserModel.find({}, (err, docs) => {
        return docs as GuestUserModel[];
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Saves a GuestUserModel to the mongodb.
   * @private
   * @param {GuestUserModel} guestUserModel
   * @returns {Promise<void>}
   * @memberof GuestUserService
   */
  private async saveGuestUserModelToMongodb(
    guestUserModel: GuestUserModel,
  ): Promise<void> {
    try {
      await new this.guestUserModel(guestUserModel).save();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * Deletes an entry from the mongodb. Uses the unique email address identifier.
   * @private
   * @param {string} emailAddress
   * @returns {Promise<void>} empty promise when the operation succeeds
   * @memberof GuestUserService
   */
  private async deleteGuestUserModelFromMongodb(
    emailAddress: string,
  ): Promise<void> {
    try {
      await this.guestUserModel.deleteOne({ emailAddress });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * Creates a GuestUserModel that can be saved to the mongodb.
   * Adds expiration date equal to the toDate. (Auto expires and deletes the record when this time is passed - 60 seconds interval)
   * @private
   * @param {GuestUser} guestUser generated object used by the ISE API
   * @returns {GuestUserModel} valid guest model used in the mongodb
   * @memberof GuestUserService
   */
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

  /**
   *
   * Generates a valid GuestAccessInfo object as needed for the ISE API.
   * @private
   * @returns {GuestAccessInfo}
   * @memberof GuestUserService
   */
  private generateGuestAccessInfo(): GuestAccessInfo {
    const toDate = moment()
      .add(this.VALID_DAYS, DAY)
      .format(MOMENT_FORMAT);
    const fromDate = moment().format(MOMENT_FORMAT);
    return {
      toDate,
      fromDate,
      location: LOCATION,
      validDays: this.VALID_DAYS + 1, //TODO: why + 1 day needed for ISE api??
    } as GuestAccessInfo;
  }

  /**
   *
   * generates a GuestInfo object as needed by the ISE API.
   * @private
   * @param {string} firstName
   * @param {string} surName
   * @param {string} password
   * @param {string} emailAddress
   * @returns {GuestInfo}
   * @memberof GuestUserService
   */
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

  /**
   * generates a GuestUser object as needed by the ISE API.
   * @private
   * @param {GuestInfo} guestInfo a valid GuestInfo object
   * @param {string} personBeingVisited email address from the person being visited
   * @param {string} reasonForVisit any string containing the reason for visit
   * @returns {GuestUser}
   * @memberof GuestUserService
   */
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

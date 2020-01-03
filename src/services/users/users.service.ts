import { Injectable } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { UserMongoose } from 'src/models/UserMongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/models/CreateUserDto.dto';

/**
 * class used to create new administrator users
 * saves the
 *
 * @export
 * @class UsersService
 */
@Injectable()
export class UsersService {
  /**
   *Creates an instance of UsersService.
   * @param {Model<UserMongoose>} userModel the model used by mongodb
   * @memberof UsersService
   */
  constructor(@InjectModel('User') private userModel: Model<UserMongoose>) {}

  /**
   * creates a user and saves it in the user model
   *
   * @param {CreateUserDto} createUserDto create user DTO containing email and password
   * @returns {Promise<void>}
   * @memberof UsersService
   */
  public async create(createUserDto: CreateUserDto): Promise<void> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * retrieves a user by email address (the unique identifier)
   *
   * @param {string} email
   * @returns {Promise<Model<UserMongoose>>}
   * @memberof UsersService
   */
  public async findOneByEmail(email: string): Promise<Model<UserMongoose>> {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      console.log(error);
    }
  }
}

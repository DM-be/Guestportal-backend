import { Injectable } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { UserMongoose } from 'src/models/UserMongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/models/CreateUserDto.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private userModel: Model<UserMongoose>) {}

    async create(createUserDto: CreateUserDto): Promise<void> {
  
      let createdUser  = new this.userModel(createUserDto);
      return await createdUser.save();
  
    }
  
    async findOneByEmail(email: string): Promise<Model<UserMongoose>> {
  
      return await this.userModel.findOne({email: email});
  
    }
  
}

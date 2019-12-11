import { Injectable } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/models/User';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/models/CreateUserDto';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto) {
  
      let createdUser  = new this.userModel(createUserDto);
      return await createdUser.save();
  
    }
  
    async findOneByEmail(email): Model<User> {
  
      return await this.userModel.findOne({email: email});
  
    }
  
}

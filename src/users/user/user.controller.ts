import { Controller, Body, Post } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from 'src/models/CreateUserDto.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {

    }

    @ApiCreatedResponse({ description: 'The user has been successfully created.'})
    @Post() 
    async create(@Body() createUserDto: CreateUserDto) {
        let res =  await this.usersService.create(createUserDto);
        console.log(res);
        return res;
    }

    /*

    curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"dentest2@test.com","password":"xyz"}' \
   http://localhost:3000/users
  */
}

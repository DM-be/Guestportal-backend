import { Controller, Body, Post } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { CreateUserDto } from 'src/models/CreateUserDto.dto';
import { ApiCreatedResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request, create user model not found'
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    let res = await this.usersService.create(createUserDto);
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

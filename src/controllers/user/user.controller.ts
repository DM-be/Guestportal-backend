import { Controller, Body, Post } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { CreateUserDto } from 'src/models/CreateUserDto.dto';
import {
  ApiCreatedResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

/**
 * controller responsible for creating new administrator users
 *
 * @export
 * @class UsersController
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * creates a new administrator user using a create user dto
   *
   * @param {CreateUserDto} createUserDto
   * @returns
   * @memberof UsersController
   */
  @ApiCreatedResponse({
    description: 'The administrator user has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request, create user model not found',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      return error;
    }
  }
}

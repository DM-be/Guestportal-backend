import { Controller, Post, Body, Get } from '@nestjs/common';
import { GuestUserService } from 'src/services/guest-user/guest-user.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CreateGuestUserDto } from 'src/models/CreateGuestUserDto.dto';
import { GuestUserModel } from 'src/models/GuestUserModel';

@ApiTags('Guest users')
@Controller('guest-user')
export class GuestUserController {
  constructor(private guestUserService: GuestUserService) {}

  @ApiOkResponse({
    description: 'Created ise guest user successfully',
  })
  @Post()
  async createIseGuestUser(@Body() createGuestUserDto: CreateGuestUserDto) {
    try {
      return await this.guestUserService.createGuestUser(createGuestUserDto);
    } catch (error) {
      return error;
    }
  }

  @Get()
  getGuestUsers(): GuestUserModel[] {
    try {
      return this.guestUserService.guestUsers$.getValue();
    } catch (error) {
      console.log(error);
    }
  }
}

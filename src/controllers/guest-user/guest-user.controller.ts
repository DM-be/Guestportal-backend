import { Controller, Post, Body, Get, UseGuards, Delete, Param } from '@nestjs/common';
import { GuestUserService } from 'src/services/guest-user/guest-user.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CreateGuestUserDto } from 'src/models/CreateGuestUserDto.dto';
import { GuestUserModel } from 'src/models/GuestUserModel';
import { AuthGuard } from '@nestjs/passport';
import { RemoveGuestUserDto } from 'src/models/RemoveGuestUserDto';

/**
 * controller responsible for creating ISE guest users
 *
 * @export
 * @class GuestUserController
 */
@ApiTags('Guest users')
@Controller('guest-user')
export class GuestUserController {
  /**
   *Creates an instance of GuestUserController.
   * @param {GuestUserService} guestUserService the guestUser service (communicates with the ISE service)
   * @memberof GuestUserController
   */
  constructor(private guestUserService: GuestUserService) {}

  /**
   * creates an ISE guest user using the guestuser service
   *
   * @param {CreateGuestUserDto} createGuestUserDto
   * @returns {Promise<void>}
   * @memberof GuestUserController
   */
  @ApiOkResponse({
    description: 'Created ise guest user successfully',
  })
  @Post()
  async createIseGuestUser(
    @Body() createGuestUserDto: CreateGuestUserDto,
  ): Promise<void> {
    try {
      return await this.guestUserService.createGuestUser(createGuestUserDto);
    } catch (error) {
      return error;
    }
  }


    /**
   * removes an ISE guest user using the guestuser service
   *
   * @param {RemoveGuestUserDto} removeGuestUserDto
   * @returns {Promise<void>}
   * @memberof GuestUserController
   */
  @ApiOkResponse({
    description: 'removed ise guest user successfully',
  })

  
  @Delete(':emailAddress')
  async removeIseGuestUser(
    @Param('emailAddress') emailAddress: string,
  ): Promise<void> {
    try {
      console.log(` removing ${emailAddress}`)
      return await this.guestUserService.removeGuestUser(emailAddress);
    } catch (error) {
      return error;
    }
  }



  /**
   *returns an array of Guest User Models
   * used for initialization of the admin component in the frontend
   *
   * @returns {GuestUserModel[]}
   * @memberof GuestUserController
   */
  @Get()
 // @UseGuards(AuthGuard()) 
  getGuestUsers(): GuestUserModel[] {
    try {
      return this.guestUserService.guestUsers$.getValue();
    } catch (error) {
      return error;
    }
  }
}

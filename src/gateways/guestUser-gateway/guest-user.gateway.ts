import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
  } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { GuestUserService } from 'src/services/guest-user/guest-user.service';
import { RemoveGuestUserDto } from 'src/models/RemoveGuestUserDto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@WebSocketGateway()
export class GuestUserGateWay {
  @WebSocketServer() server;

  constructor(private guestUserService: GuestUserService) {}

 // @UseGuards(AuthGuard())
  @SubscribeMessage('removeUser')
  private async removeGuestUser(client: Socket, removeGuestUserDto: RemoveGuestUserDto) {
    try {
      console.log('removing....')
      await this.guestUserService.removeGuestUser(removeGuestUserDto);
    } catch (error) {
      
    }

  

  }



 
}
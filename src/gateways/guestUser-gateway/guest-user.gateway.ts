import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { GuestUserService } from 'src/services/guest-user/guest-user.service';
import { RemoveGuestUserDto } from 'src/models/RemoveGuestUserDto';

@WebSocketGateway()
export class GuestUserGateWay {
  @WebSocketServer() server;

  constructor(private guestUserService: GuestUserService) {
    
    this.subscribeToGuestUserDatabaseChanges();
  }

  // @UseGuards(AuthGuard())
  @SubscribeMessage('removeUser')
  private async removeGuestUser(
    client: Socket,
    removeGuestUserDto: RemoveGuestUserDto,
  ) {
    try {
      console.log('removing....');
      await this.guestUserService.removeGuestUser(removeGuestUserDto);
    } catch (error) {}
  }

  //returns full db
  public async subscribeToGuestUserDatabaseChanges() {
    this.guestUserService.guestUsers$.subscribe(guestUserModelArray => {
      if(guestUserModelArray.length > 0)
      {
        console.log("dbchange")
        console.log(guestUserModelArray);
        this.server.emit('guestUserDatabaseChange', guestUserModelArray);
      }
      
    });
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { EidUserDto } from 'src/models/EidUserDto';
import { GuestUserService } from 'src/services/guest-user/guest-user.service';
import { Socket } from 'dgram';
import { RemoveGuestUserDto } from 'src/models/RemoveGuestUserDto';

@WebSocketGateway()
export class EidGateway {
  @WebSocketServer() server;

  constructor() {}

  public async emitEidUser(EidUserDto: EidUserDto): Promise<void> {
    try {
      await this.server.emit('readCardDataEvent', EidUserDto);
    } catch (error) {
      console.log(`failed to emit EidUser:  ${error}`);
    }
  }
}

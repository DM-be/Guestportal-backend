import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EidUser } from 'src/models/EidUser';

@WebSocketGateway()
export class EidGateway {
  @WebSocketServer() server;

  public async emitEidUser(eidUser: EidUser): Promise<void> {
    try {
      await this.server.emit('eidUser', eidUser);
    } catch (error) {
      console.log(`failed to emit EidUser:  ${error}`);
    }
  }
}

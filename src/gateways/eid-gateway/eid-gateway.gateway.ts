import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EidUserDto } from 'src/models/EidUserDto';



const ALLOWED_ORIGINS = 'localhost:4200'


@WebSocketGateway(3001, { origin: ALLOWED_ORIGINS})
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

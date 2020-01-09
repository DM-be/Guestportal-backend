import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { EidUserDto } from 'src/models/EidUserDto';

const ALLOWED_ORIGINS = 'localhost:4200';
const READ_CARD_EVENT = 'readCardDataEvent';

/**
 * public gateway connection, sending eID card data to the frontend
 * listens on port 3001
 *
 * @export
 * @class EidGateway
 */
@WebSocketGateway(5001, { origin: ALLOWED_ORIGINS })
export class EidGateway {
  @WebSocketServer() server;

  /**
   * public function used by the pkcs11 service, emits the eID user data in a dto on successfull reading of the card data event
   *
   *
   * @param {EidUserDto} EidUserDto
   * @returns {Promise<void>}
   * @memberof EidGateway
   */
  public async emitEidUser(EidUserDto: EidUserDto): Promise<void> {
    try {
      await this.server.emit(READ_CARD_EVENT, EidUserDto);
    } catch (error) {
      throw new WsException(error);
    }
  }
}

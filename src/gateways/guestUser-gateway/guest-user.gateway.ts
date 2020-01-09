import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  WsException,
} from '@nestjs/websockets';
import { GuestUserService } from 'src/services/guest-user/guest-user.service';
import { RemoveGuestUserDto } from 'src/models/RemoveGuestUserDto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';
import { AuthService } from 'src/services/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/models/JwtPayload';
import { TokenResponse } from 'src/models/TokenResponse';

const ALLOWED_ORIGINS = 'localhost:4200';
const REMOVE_USER = 'removeUser';
const REFRESH_TOKEN = 'refreshToken';
const SECRET_KEY = 'secretKey'; //TODO: get from vault or helper service for secret keys
const GUEST_USER_DB_CHANGE = 'guestUserDatabaseChange';

/**
 * the GuestUserGateway provided for guest user actions
 * secured through the assigned JWT token for admin users
 *
 * @export
 * @class GuestUserGateWay
 * @implements {OnGatewayConnection}
 */
@WebSocketGateway(3002, { origin: ALLOWED_ORIGINS })
export class GuestUserGateWay implements OnGatewayConnection {
  @WebSocketServer() server;

  constructor(
    private guestUserService: GuestUserService,
    private authService: AuthService,
  ) {
    this.subscribeToGuestUserDatabaseChanges();
  }

  /**
   * handles the client socket from the frontend
   * when the client connects, the token is verified wit the secret key
   * on verification the websocket emits the refreshed token through the secure connection
   *
   * @param {Socket} client the frontend client
   * @returns {Promise<void>}
   * @memberof GuestUserGateWay
   */
  public async handleConnection(client: Socket): Promise<void> {
  
    try {
     
      const token = client.handshake.query.token;
      console.log(token);
      const jwtPayload: JwtPayload = await <JwtPayload>jwt.verify(token, SECRET_KEY);
      const refreshedToken: TokenResponse = await this.authService.validateUserByJwt(
        jwtPayload,
      );
      await this.refreshClientToken(refreshedToken);
    } catch (error) {
      return error;
    } finally {
      client.disconnect();
    }
  }

  /**
   * removes a guest user using the guestuser service and the removeguestuserdto
   * is protected by the guard decorator, only messages with the token included in the emit are allowed
   * @param {RemoveGuestUserDto} removeGuestUserDto the emailaddress of the guest user
   * @returns
   * @memberof GuestUserGateWay
   */
  @UseGuards(AuthGuard())
  @SubscribeMessage(REMOVE_USER)
  public async removeGuestUser(removeGuestUserDto: RemoveGuestUserDto) {
    try {
      await this.guestUserService.removeGuestUser(removeGuestUserDto);
    } catch (error) {
      return await Promise.reject(error);
    }
  }

  /**
   * subscription to the guest user subject in the guest user service
   * whenever a user is added or removed, the socket will emit the full new guest user model array
   * the frontend also subscribes to this event using the same logic
   *
   *
   * @private
   * @memberof GuestUserGateWay
   */
  private async subscribeToGuestUserDatabaseChanges() {
    this.guestUserService.guestUsers$.subscribe(async guestUserModelArray => {
      if (guestUserModelArray) {
        await this.server.emit(GUEST_USER_DB_CHANGE, guestUserModelArray);
      }
    });
  }

  /**
   * emits a refreshed token for the connected client
   *
   * @private
   * @param {TokenResponse} tokenResponse
   * @returns {Promise<void>}
   * @memberof GuestUserGateWay
   */
  @UseGuards(AuthGuard())
  public async refreshClientToken(tokenResponse: TokenResponse): Promise<void> {
    try {
      await this.server.emit(REFRESH_TOKEN, tokenResponse);
    } catch (error) {
      return await Promise.reject(new WsException(error));
    }
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { GuestUserService } from 'src/services/guest-user/guest-user.service';
import { RemoveGuestUserDto } from 'src/models/RemoveGuestUserDto';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';
import { AuthService } from 'src/services/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/models/JwtPayload';
import { TokenResponse } from 'src/models/TokenResponse';

const ALLOWED_ORIGINS = 'localhost:4200';

@WebSocketGateway(3002, { origin: ALLOWED_ORIGINS })
export class GuestUserGateWay implements OnGatewayConnection {
  @WebSocketServer() server;

  constructor(
    private guestUserService: GuestUserService,
    private authService: AuthService,
  ) {
    this.subscribeToGuestUserDatabaseChanges();
  }

  async handleConnection(client: Socket) {
    console.log(client.handshake.query.token);
    // const token = client.handshake.query.token;
    // const jwtPayload: JwtPayload = <JwtPayload>jwt.verify(token, 'secretkey'); //TODO: get secretkey from env
    // try {
    //   const refreshedToken: TokenResponse = await this.authService.validateUserByJwt(
    //     jwtPayload,
    //   );
    //   await this.refreshClientToken(refreshedToken);
    // } catch (error) {
    //   console.log('token not valid');
    //   client.disconnect();
    // }
  }

  // @UseGuards(AuthGuard())
  @SubscribeMessage('removeUser')
  private async removeGuestUser(removeGuestUserDto: RemoveGuestUserDto) {
    try {
      console.log('removing....');
      // await this.guestUserService.removeGuestUser(removeGuestUserDto);
    } catch (error) {}
  }

  private async subscribeToGuestUserDatabaseChanges() {
    this.guestUserService.guestUsers$.subscribe(async guestUserModelArray => {
      if (guestUserModelArray) {
        await this.server.emit('guestUserDatabaseChange', guestUserModelArray);
      }
    });
  }

  @UseGuards(AuthGuard())
  private async refreshClientToken(tokenResponse: TokenResponse) {
    try {
      await this.server.emit('refreshToken', tokenResponse);
    } catch (error) {
      console.log(error);
    }
  }
}

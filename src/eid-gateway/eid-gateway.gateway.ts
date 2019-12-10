import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { EidUser } from 'src/models/EidUser';

@WebSocketGateway()
export class EidGateway {

    @WebSocketServer() server;

    public async sendEidUser(eidUser: EidUser) {
        this.server.emit('eidUser', eidUser);
    }


}
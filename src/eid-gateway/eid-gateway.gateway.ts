import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway()
export class EidGateway {

    @WebSocketServer() server;

    public async sendEidData(obj: any) {
        this.server.emit('eid-info',obj)
    }


}
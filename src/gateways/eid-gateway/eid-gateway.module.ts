import { Module } from '@nestjs/common';
import { EidGateway } from './eid-gateway.gateway';


@Module({
    providers: [ EidGateway ]
})
export class EidGatewayModule {}

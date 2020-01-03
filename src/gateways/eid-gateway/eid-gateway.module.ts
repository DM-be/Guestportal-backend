import { Module } from '@nestjs/common';
import { EidGateway } from './eid-gateway.gateway';

@Module({
  providers: [EidGateway],
  exports: [EidGateway],
})
export class EidGatewayModule {}

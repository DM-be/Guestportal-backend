import { Module } from '@nestjs/common';
import { EidGateway } from './eid-gateway.gateway';
import { GuestUserService } from 'src/services/guest-user/guest-user.service';
import { IseService } from 'src/services/ise/ise.service';
import { GuestUserModule } from 'src/services/guest-user/guest-user.module';


@Module({
    providers: [ EidGateway ],
    exports: [EidGateway]
})
export class EidGatewayModule {}

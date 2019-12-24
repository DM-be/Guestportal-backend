import { Module } from '@nestjs/common';
import { GuestUserGateWay } from './guest-user.gateway';
import { PassportModule } from '@nestjs/passport';
import { GuestUserModule } from 'src/services/guest-user/guest-user.module';

@Module({
  providers: [GuestUserGateWay],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    GuestUserModule
  ],
  exports: [GuestUserGateWay]
})
export class GuestUserGateWayModule {}


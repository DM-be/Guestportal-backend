import { Module } from '@nestjs/common';
import { GuestUserGateWay } from './guest-user.gateway';
import { PassportModule } from '@nestjs/passport';
import { GuestUserModule } from 'src/services/guest-user/guest-user.module';
import { AuthModule } from 'src/services/auth/auth.module';

@Module({
  providers: [GuestUserGateWay, AuthModule],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    GuestUserModule,
    AuthModule
  ],
  exports: [GuestUserGateWay]
})
export class GuestUserGateWayModule {}


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth/auth.service';
import { JwtPayload } from 'src/models/JwtPayload';
import { TokenResponse } from 'src/models/TokenResponse';

/**
 * The default strategy used by the authguard decorators.
 * Extracts the JWT token from the header and validates it using the authentication service
 *
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretkey',
    });
  }

  /**
   * Validates a user given a given JWT payload.
   * Returns a valid new TokenResponse
   *
   *
   * @param {JwtPayload} payload
   * @returns {Promise<TokenResponse>} Promise containing a valid JWT token
   * @memberof JwtStrategy
   */
  async validate(payload: JwtPayload): Promise<TokenResponse> {
    const signedResponse = await this.authService.validateUserByJwt(payload);
    if (!signedResponse) {
      throw new UnauthorizedException();
    }
    return signedResponse;
  }
}

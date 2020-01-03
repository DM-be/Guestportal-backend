import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/services/users/users.service';
import { JwtPayload } from 'src/models/JwtPayload';
import { TokenResponse } from 'src/models/TokenResponse';
import { LoginUserDto } from 'src/models/LoginUserDto.dto';
import { UserMongoose } from 'src/models/UserMongoose';
import { Model } from 'mongoose';

/**
 * authentication service used to for user (admin) validation
 * supports finding a user in the database and checking the encrypted password
 * validates JWT tokens and issues new tokens when they are validated
 *
 * @export
 * @class AuthService
 */

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * validates a user given his email and clear text password
   * checks the hashed passwords and returns a valid token when validation is successfull
   *
   * @param {LoginUserDto} loginAttempt Email and password from the user
   * @returns {Promise<TokenResponse>} Promise containing the token as a response
   * @memberof AuthService
   */
  public async validateUserByPassword(
    loginAttempt: LoginUserDto,
  ): Promise<TokenResponse> {
    const userToAttempt: Model<UserMongoose> = await this.usersService.findOneByEmail(
      loginAttempt.email,
    );
    return new Promise(resolve => {
      userToAttempt.checkPassword(loginAttempt.password, (err, isMatch) => {
        if (err) throw new UnauthorizedException();
        if (isMatch) {
          resolve(this.createJwtPayload(userToAttempt));
        } else {
          throw new UnauthorizedException();
        }
      });
    });
  }

  /**
   * Validates the user when he is already logged in with his JWT
   *
   * @param {JwtPayload} payload payload from within the JWT token
   * @returns {Promise<TokenResponse>} a new signed token response
   * @memberof AuthService
   */
  async validateUserByJwt(payload: JwtPayload): Promise<TokenResponse> {
    const user: Model<UserMongoose> = await this.usersService.findOneByEmail(
      payload.email,
    );
    if (user) {
      return this.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  /**
   * creates a signed JWTPayload from a user model and returns this as a TokenResponse object
   *
   * @private
   * @param {Model<UserMongoose>} userMongoose user model used by mongodb
   * @returns {TokenResponse} response containing the signed JWT token
   * @memberof AuthService
   */
  private createJwtPayload(userMongoose: Model<UserMongoose>): TokenResponse {
    const data: JwtPayload = {
      email: userMongoose.email,
    };
    const jwt = this.jwtService.sign(data);
    const tokenReponse: TokenResponse = {
      expiresIn: 3600,
      token: jwt,
    };
    return tokenReponse;
  }
}

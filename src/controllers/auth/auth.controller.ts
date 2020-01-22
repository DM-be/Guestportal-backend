import { Controller, Post, Body } from '@nestjs/common';
import { LoginUserDto } from 'src/models/LoginUserDto.dto';
import { AuthService } from '../../services/auth/auth.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { TokenResponse } from 'src/models/TokenResponse';
import { AdminUserIncorrectPasswordError } from 'src/models/AdminUserIncorrectPasswordError';
import { AdminUserDoesNotExistError } from 'src/models/AdminUserDoesNotExistError';

/**
 * controller responsible for authentication of admin users
 *
 *
 * @export
 * @class AuthController
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   *  authenticates a user by responding with a valid JWT token
   *
   * @param {LoginUserDto} loginUserDto email and password object from a user
   * @returns {Promise<TokenResponse>} once resolved, contains a valid JWT token, signed by the authentication service
   * @memberof AuthController
   */
  @ApiOkResponse({
    description: 'Authenticated user successfully',
  })
  @Post()
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<
    TokenResponse | AdminUserIncorrectPasswordError | AdminUserDoesNotExistError
  > {
    try {
      return await this.authService.validateUserByPassword(loginUserDto);
    } catch (error) {
      console.log(error.message)
      return error;
    }
  }
}

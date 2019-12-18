import { Controller, Post, Body } from '@nestjs/common';
import { LoginUserDto } from 'src/models/LoginUserDto.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {


    constructor(private authService: AuthService) {

    }


    @Post() 
    async login(@Body() loginUserDto: LoginUserDto){
        let res = await this.authService.validateUserByPassword(loginUserDto);
        console.log(res);
        return res;
    }


    /*

      curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"dentest2@test.com","password":"xyz"}' \
   http://localhost:3000/auth

   */
}

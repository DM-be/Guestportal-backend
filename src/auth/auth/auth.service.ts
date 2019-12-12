import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from 'src/models/LoginUserDto';
import { JwtPayload } from 'src/models/JwtPayload';
import { TokenResponse } from 'src/models/TokenResponse';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService){

    }

    async validateUserByPassword(loginAttempt: LoginUserDto): Promise<TokenResponse> {

        // This will be used for the initial login
        const userToAttempt = await this.usersService.findOneByEmail(loginAttempt.email);
        
        return new Promise((resolve) => {

            // Check the supplied password against the hash stored for this email address
            userToAttempt.checkPassword(loginAttempt.password, (err, isMatch) => {
    
                if(err) throw new UnauthorizedException();
    
                if(isMatch){
                    // If there is a successful match, generate a JWT for the user
                    resolve(this.createJwtPayload(userToAttempt));
    
                } else {
                    throw new UnauthorizedException();
                }
    
            });

        });

    }

    async validateUserByJwt(payload: JwtPayload): Promise<TokenResponse> { 

        // This will be used when the user has already logged in and has a JWT
        let user = await this.usersService.findOneByEmail(payload.email);
        if(user){
            return this.createJwtPayload(user);
        } else {
            throw new UnauthorizedException();
        }

    }

    private createJwtPayload(user): TokenResponse {

        const data: JwtPayload = {
            email: user.email
        };
        const jwt = this.jwtService.sign(data);
        const tokenReponse: TokenResponse = {
            expiresIn: 3600,
            token: jwt
        }
        return tokenReponse;

    }

}
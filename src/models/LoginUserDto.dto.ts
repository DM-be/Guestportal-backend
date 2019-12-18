import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {

    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    readonly password: string; 
}
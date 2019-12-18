import { IsEmail, IsNotEmpty } from 'class-validator';
// front end dto 

export class CreateGuestUserDto { // name? --> 
    @IsNotEmpty()
    firstName: string; 
    @IsNotEmpty()
    surName: string;
    @IsEmail()
    emailAddress: string;
    @IsNotEmpty()
    password: string;
    reasonForVisit?: string;
    @IsEmail()
    personBeingVisited?: string;

    
}


import { IsDefined, IsString, MinLength } from "class-validator";

export class SignInDto {

    @IsString()
    @IsDefined()
    public login: string;

    @IsString()
    @IsDefined()
    @MinLength(6)
    public password: string;

}
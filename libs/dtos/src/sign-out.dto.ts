import { IsDefined, IsString } from "class-validator";

export class SignOutDto {

    @IsDefined()
    @IsString()
    public refreshToken: string;

}
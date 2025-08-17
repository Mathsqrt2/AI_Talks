import { IsDefined, IsString } from "class-validator";

export class RefreshTokenDto {

    @IsDefined()
    @IsString()
    public refreshToken: string;

}
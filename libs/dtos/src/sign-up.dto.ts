import { IsBoolean, IsDefined, IsString, MinLength } from "class-validator";
import { SignInDto } from "./sign-in.dto";

export class SignUpDto extends SignInDto {

    @IsString()
    @IsDefined()
    @MinLength(6)
    public confirmPassword: string;

    @IsDefined()
    @IsBoolean()
    public acceptedTerms: boolean;

}
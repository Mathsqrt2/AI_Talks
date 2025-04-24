import { IsDefined, IsString } from "class-validator";

export class ResponseInvitationDto {

    @IsDefined()
    @IsString()
    invitation: string;

}
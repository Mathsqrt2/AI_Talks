import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";
import { SwaggerMessages } from "../constants/swagger.descriptions";

export class ResponseInvitationDto {

    @ApiProperty({ description: SwaggerMessages.InvitationDto.responseInvitation() })
    @IsDefined()
    @IsString()
    invitation: string;

}
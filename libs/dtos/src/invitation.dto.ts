import { IsDefined, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class InvitationDto {

    @ApiProperty({ description: SwaggerMessages.InvitationDto.responseInvitation() })
    @IsDefined()
    @IsString()
    public invitation: string;

}
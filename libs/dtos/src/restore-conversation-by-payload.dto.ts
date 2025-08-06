import { IsDefined, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class RestoreConversationPayloadDto {

    @ApiProperty({ description: SwaggerMessages.restoreConversationDto.aboutPayloadId(), example: '123abc456def', required: true })
    @IsDefined()
    @IsString()
    public id: string;

}
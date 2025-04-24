import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";
import { SwaggerMessages } from "../constants/swagger.descriptions";

export class RestoreConversationByIdDto {

    @ApiProperty({ description: SwaggerMessages.restoreConversationDto.aboutId(), example: '123abc456def', required: true })
    @IsDefined()
    @IsString()
    id: string;

}
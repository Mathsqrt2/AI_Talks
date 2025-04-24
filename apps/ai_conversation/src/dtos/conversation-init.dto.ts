import { SwaggerMessages } from "../constants/swagger.descriptions";
import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ConversationInitDto {

    @ApiProperty({ description: SwaggerMessages.conversationInitDto.promptDescription(), example: SwaggerMessages.conversationInitDto.promptExample() })
    @IsString()
    @IsOptional()
    prompt?: string;

}
import { IsOptional, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class ConversationInitDto {

    @ApiProperty({ description: SwaggerMessages.conversationInitDto.promptDescription(), example: SwaggerMessages.conversationInitDto.promptExample() })
    @IsString()
    @IsOptional()
    prompt?: string;

}
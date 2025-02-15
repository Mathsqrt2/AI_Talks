import { SwaggerMessages } from "../constants/swagger.descriptions";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ConversationInitDto {

    @ApiProperty({ description: SwaggerMessages.conversationInitDto.promptDescription(), example: `What do you think about astronomy?` })
    @IsString()
    @IsOptional()
    prompt: string;

}
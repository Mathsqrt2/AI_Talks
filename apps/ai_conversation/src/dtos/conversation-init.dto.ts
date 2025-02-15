import { SwaggerMessages } from "../constants/swagger.descriptions";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ConversationInitDto {

    @ApiProperty({ description: SwaggerMessages.conversationInitDto.promptDescription(), example: `What do you think about astronomy?` })
    @IsString()
    prompt: string;

}
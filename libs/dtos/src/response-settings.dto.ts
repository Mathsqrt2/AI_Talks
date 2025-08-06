import { IsBoolean, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { ResponseStateDto, ResponsePromptsDto } from "./dtos";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ResponseSettingsDto {

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.conversationNameDescription(), example: `0a44b8b588aaea880e339b35eb3abf06acb1a20cbe431e7f00a12588bafba9fb` })
    @IsString()
    conversationName: string;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.isConversationInProgressDescription(), example: true })
    @IsBoolean()
    isConversationInProgres: boolean;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.maxMessagesCountDescription(), example: 128 })
    @IsNumber()
    maxMessagesCount: number;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.maxContextSizeDescription(), example: 4096 })
    @IsNumber()
    maxContextSize: number;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.stateDescription(), example: { shouldContinue: true, shouldNotify: false, lastBotMessages: [], currentMessageIndex: 0 } })
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => ResponseStateDto)
    state: ResponseStateDto;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.promptsDescription(), example: { initialPrompt: "Hello! How can I help?", contextPrompt: "Keep your answers concise." } })
    @IsString()
    @ValidateNested({ each: true })
    @Type(() => ResponsePromptsDto)
    prompts: ResponsePromptsDto;

}
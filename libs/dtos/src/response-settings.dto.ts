import { IsBoolean, IsDefined, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { ResponseStateDto, ResponsePromptsDto } from "./dtos";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ResponseSettingsDto {

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.conversationNameDescription(), example: `0a44b8b588aaea880e339b35eb3abf06acb1a20cbe431e7f00a12588bafba9fb` })
    @IsDefined()
    @IsString()
    public conversationName: string;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.isConversationInProgressDescription(), example: true })
    @IsDefined()
    @IsBoolean()
    public isConversationInProgres: boolean;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.maxMessagesCountDescription(), example: 128 })
    @IsDefined()
    @IsNumber()
    public maxMessagesCount: number;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.maxContextSizeDescription(), example: 4096 })
    @IsDefined()
    @IsNumber()
    public maxContextSize: number;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.stateDescription(), example: { shouldContinue: true, shouldNotify: false, lastBotMessages: [], currentMessageIndex: 0 } })
    @IsDefined()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => ResponseStateDto)
    public state: ResponseStateDto;

    @ApiProperty({ description: SwaggerMessages.responseSettingsDto.promptsDescription(), example: { initialPrompt: "Hello! How can I help?", contextPrompt: "Keep your answers concise." } })
    @IsDefined()
    @IsString()
    @ValidateNested({ each: true })
    @Type(() => ResponsePromptsDto)
    public prompts: ResponsePromptsDto;

}
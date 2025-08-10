import { IsBoolean, IsDefined, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { StateDto, PromptsDto } from "./dtos";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class SettingsDto {

    @ApiProperty({ description: SwaggerMessages.settingsDto.conversationNameDescription(), example: `0a44b8b588aaea880e339b35eb3abf06acb1a20cbe431e7f00a12588bafba9fb` })
    @IsDefined()
    @IsString()
    public conversationName: string;

    @ApiProperty({ description: SwaggerMessages.settingsDto.conversationIdDescription(), example: 1 })
    @IsDefined()
    @IsNumber()
    public conversationId: number;

    @ApiProperty({ description: SwaggerMessages.settingsDto.isConversationInProgressDescription(), example: true })
    @IsDefined()
    @IsBoolean()
    public isConversationInProgres: boolean;

    @ApiProperty({ description: SwaggerMessages.settingsDto.maxMessagesCountDescription(), example: 128 })
    @IsDefined()
    @IsNumber()
    public maxMessagesCount: number;

    @ApiProperty({ description: SwaggerMessages.settingsDto.maxContextSizeDescription(), example: 4096 })
    @IsDefined()
    @IsNumber()
    public maxContextSize: number;

    @ApiProperty({ description: SwaggerMessages.settingsDto.maxAttemptsDescription(), example: 2048 })
    @IsDefined()
    @IsNumber()
    public maxAttempts: number;

    @ApiProperty({ description: SwaggerMessages.settingsDto.retryAfterTimeInMilisecondsDescription(), example: 1000 })
    @IsDefined()
    @IsNumber()
    public retryAfterTimeInMiliseconds: number;

    @ApiProperty({ description: SwaggerMessages.settingsDto.stateDescription(), example: { shouldContinue: true, shouldNotify: false, lastBotMessages: [], currentMessageIndex: 0 } })
    @IsDefined()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => StateDto)
    public state: StateDto;

    @ApiProperty({ description: SwaggerMessages.settingsDto.promptsDescription(), example: { initialPrompt: "Hello! How can I help?", contextPrompt: "Keep your answers concise." } })
    @IsDefined()
    @IsString()
    @ValidateNested({ each: true })
    @Type(() => PromptsDto)
    public prompts: PromptsDto;

}
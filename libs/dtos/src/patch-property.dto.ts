import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { PatchPromptsDto } from "./patch-prompts.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PatchStateDto } from "./patch-state.dto";
import { SwaggerMessages } from "@libs/constants";
import { Type } from "class-transformer";

export class PatchPropertyDto {

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.conversationNameDescription(), example: "AI Talks — Friday Session" })
    @IsOptional()
    @IsString()
    public conversationName?: string;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.conversationIdDescription(), example: 123 })
    @IsOptional()
    @IsNumber()
    public conversationId?: number;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.isConversationInProgressDescription(), example: true })
    @IsOptional()
    @IsBoolean()
    public isConversationInProgress?: boolean;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.maxMessagesCountDescription(), example: 200 })
    @IsOptional()
    @IsNumber()
    public maxMessagesCount?: number;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.maxContextSizeDescription(), example: 8192 })
    @IsOptional()
    @IsNumber()
    public maxContextSize?: number;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.maxAttemptsDescription(), example: 3 })
    @IsOptional()
    @IsNumber()
    public maxAttempts?: number;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.retryAfterTimeInMilisecondsDescription(), example: 1500 })
    @IsOptional()
    @IsNumber()
    public retryAfterTimeInMiliseconds?: number;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.stateDescription(), type: () => PatchStateDto })
    @IsOptional()
    @IsObject()
    @Type(() => PatchStateDto)
    public state?: PatchStateDto;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPropertyDto.promptsDescription(), type: () => PatchPromptsDto })
    @IsOptional()
    @IsObject()
    @Type(() => PatchPromptsDto)
    public prompts?: PatchPromptsDto;

}

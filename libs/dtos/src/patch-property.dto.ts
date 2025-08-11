import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { PatchPromptsDto } from "./patch-prompts.dto";
import { PatchStateDto } from "./patch-state.dto";
import { Type } from "class-transformer";

export class PatchPropertyDto {


    @IsOptional()
    @IsString()
    public conversationName?: string;

    @IsOptional()
    @IsNumber()
    public conversationId?: number;

    @IsOptional()
    @IsBoolean()
    public isConversationInProgres?: boolean;

    @IsOptional()
    @IsNumber()
    public maxMessagesCount?: number;

    @IsOptional()
    @IsNumber()
    public maxContextSize?: number;

    @IsOptional()
    @IsNumber()
    public maxAttempts?: number;

    @IsOptional()
    @IsNumber()
    public retryAfterTimeInMiliseconds?: number;

    @IsOptional()
    @IsObject()
    @Type(() => PatchStateDto)
    public state?: PatchStateDto;

    @IsOptional()
    @IsObject()
    @Type(() => PatchPromptsDto)
    public prompts?: PatchPromptsDto;

}
import { IsOptional, IsString } from "class-validator";
import { PromptsEnum } from "@libs/enums";

export class PatchPromptsDto {


    @IsOptional()
    @IsString()
    [PromptsEnum.CONTEXT_PROMPT]?: string;

    @IsOptional()
    @IsString()
    [PromptsEnum.CONTEXT_PROMPT_1]?: string;

    @IsOptional()
    @IsString()
    [PromptsEnum.CONTEXT_PROMPT_2]?: string;

    @IsOptional()
    @IsString()
    [PromptsEnum.INITIAL_PROMPT]?: string;

    @IsOptional()
    @IsString()
    [PromptsEnum.INJECTOR_PROMPT]?: string;

    @IsOptional()
    @IsString()
    [PromptsEnum.SUMMARIZER_PROMPT]?: string;

}
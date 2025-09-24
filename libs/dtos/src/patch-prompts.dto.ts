import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { SwaggerMessages } from "@libs/constants";
import { PromptsEnum } from "@libs/enums";


export class PatchPromptsDto {

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPromptsDto.contextPromptDescription() })
    @IsOptional()
    @IsString()
    [PromptsEnum.CONTEXT_PROMPT]?: string;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPromptsDto.contextPrompt1Description() })
    @IsOptional()
    @IsString()
    [PromptsEnum.CONTEXT_PROMPT_1]?: string;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPromptsDto.contextPrompt2Description() })
    @IsOptional()
    @IsString()
    [PromptsEnum.CONTEXT_PROMPT_2]?: string;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPromptsDto.initialPromptDescription() })
    @IsOptional()
    @IsString()
    [PromptsEnum.INITIAL_PROMPT]?: string;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPromptsDto.injectorPromptDescription() })
    @IsOptional()
    @IsString()
    [PromptsEnum.INJECTOR_PROMPT]?: string;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchPromptsDto.summarizerPromptDescription() })
    @IsOptional()
    @IsString()
    [PromptsEnum.SUMMARIZER_PROMPT]?: string;

}

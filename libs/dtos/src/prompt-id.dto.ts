import { IsEnum, IsOptional } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { PromptsEnum } from "@libs/enums";

export class PromptDto {

    @ApiProperty({ description: SwaggerMessages.promptIdDto.aboutId(), enum: PromptsEnum, example: PromptsEnum.INITIAL_PROMPT, required: false })
    @IsOptional()
    @IsEnum(PromptsEnum)
    public prompt: PromptsEnum;

}
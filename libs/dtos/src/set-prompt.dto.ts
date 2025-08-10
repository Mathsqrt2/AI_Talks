import { IsDefined, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { PromptsEnum } from "@libs/enums";

export class SetPromptDto {

    @ApiProperty({ description: SwaggerMessages.setPromptDto.aboutPrompt(), enum: PromptsEnum, example: PromptsEnum.INITIAL_PROMPT })
    @IsDefined()
    @IsString()
    public value: PromptsEnum;
}
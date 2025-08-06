import { IsEnum, IsOptional, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { PromptTypes } from "@libs/enums";

export class PromptIdDto {

    @ApiProperty({ description: SwaggerMessages.promptIdDto.aboutId(), enum: PromptTypes, example: PromptTypes.INITIAL, required: false })
    @IsOptional()
    @IsString()
    @IsEnum(PromptTypes)
    type: PromptTypes;

}
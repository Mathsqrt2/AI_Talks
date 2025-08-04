import { IsEnum, IsOptional, IsString } from "class-validator";
import { PromptTypes } from "@libs/enums/propt-types.enum";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class PromptIdDto {

    @ApiProperty({ description: SwaggerMessages.promptIdDto.aboutId(), enum: PromptTypes, example: PromptTypes.INITIAL, required: false })
    @IsOptional()
    @IsString()
    @IsEnum(PromptTypes)
    type: PromptTypes;

}
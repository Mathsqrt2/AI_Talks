import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";
import { SwaggerMessages } from "../constants/swagger.descriptions";

export class PromptIdDto {

    @ApiProperty({ description: SwaggerMessages.promptIdDto.aboutId(), enum: ['0', '1', '2', '3', '4', '5'], example: '0', required: false })
    @IsOptional()
    @IsString()
    @IsIn([`0`, `1`, `2`, `3`, `4`, `5`])
    id: string;

}
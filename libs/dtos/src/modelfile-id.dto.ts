import { IsIn, IsOptional, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class ModelFileIdDto {

    @ApiProperty({ description: SwaggerMessages.modelfileDto.aboutId(), enum: ['0', '1', '2'], example: '1', required: false })
    @IsOptional()
    @IsString()
    @IsIn([`0`, `1`, `2`])
    id: string;

}
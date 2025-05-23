import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsPositive, Max, Min } from "class-validator";
import { SwaggerMessages } from "../constants/swagger.descriptions";

export class UpdateContextDto {

    @ApiProperty({ description: SwaggerMessages.updateContextDto.aboutContext(), example: 2048, required: true, minimum: 0, maximum: 4096 })
    @IsDefined()
    @IsNumber()
    @IsPositive()
    @Max(4096)
    @Min(0)
    context: number;
}
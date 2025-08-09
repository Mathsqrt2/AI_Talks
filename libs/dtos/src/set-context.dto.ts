import { IsDefined, IsNumber, IsPositive, Max, Min } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class SetContextDto {

    @ApiProperty({ description: SwaggerMessages.setContextDto.aboutContext(), example: 2048, required: true, minimum: 0, maximum: 4096 })
    @IsDefined()
    @IsNumber()
    @IsPositive()
    @Max(4096)
    @Min(0)
    public context: number;
}
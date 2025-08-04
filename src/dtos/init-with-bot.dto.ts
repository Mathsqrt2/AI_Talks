import { IsDefined, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SwaggerMessages } from "../constants/swagger.descriptions";

export class InitDto {

    @ApiProperty({ description: SwaggerMessages.init.aboutIdParam(), enum: ['1', '2'], example: '1', required: true })
    @IsDefined()
    @IsIn([`1`, `2`])
    id: string;

}
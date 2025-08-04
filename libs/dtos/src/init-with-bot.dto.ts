import { SwaggerMessages } from "@libs/constants";
import { IsDefined, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InitDto {

    @ApiProperty({ description: SwaggerMessages.init.aboutIdParam(), enum: ['1', '2'], example: '1', required: true })
    @IsDefined()
    @IsIn([`1`, `2`])
    id: string;

}
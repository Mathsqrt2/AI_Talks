import { StateParam } from "@libs/enums/state-param.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEnum } from "class-validator";
import { SwaggerMessages } from "../constants/swagger.descriptions";

export class ResponseStateParamDto {

    @ApiProperty({ description: SwaggerMessages.responseStateDto.aboutParam(), enum: StateParam, example: 'shouldContinue', required: true })
    @IsDefined()
    @IsEnum(StateParam)
    param: StateParam

}
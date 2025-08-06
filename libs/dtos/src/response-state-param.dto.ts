import { IsDefined, IsEnum } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { StateParam } from "@libs/enums";

export class ResponseStateParamDto {

    @ApiProperty({ description: SwaggerMessages.responseStateDto.aboutParam(), enum: StateParam, example: 'shouldContinue', required: true })
    @IsDefined()
    @IsEnum(StateParam)
    public param: StateParam

}
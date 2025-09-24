import { IsDefined, IsEnum } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { StateParamEnum } from "@libs/enums";

export class StateParamEnumDto {

    @ApiProperty({ description: SwaggerMessages.stateDto.aboutParam(), enum: StateParamEnum, example: 'shouldContinue', required: true })
    @IsDefined()
    @IsEnum(StateParamEnum)
    public param: StateParamEnum

}
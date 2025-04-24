import { StateParam } from "@libs/enums/state-param.enum";
import { IsDefined, IsEnum } from "class-validator";

export class ResponseStateParamDto {

    @IsDefined()
    @IsEnum(StateParam)
    param: StateParam

}
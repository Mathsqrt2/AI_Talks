import { InjectionMode } from "@libs/types/conversarion";
import { IsNumber, IsString } from "class-validator";
export class InjectMessageDto {

    @IsString()
    prompt: string;

    @IsString()
    mode: InjectionMode;

    @IsNumber()
    bot_id: number;

    @IsString()
    username: string;

}
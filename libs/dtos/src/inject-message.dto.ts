import { IsIn, IsNumber, IsString } from "class-validator";
import { InjectionMode } from "@libs/types/conversarion";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class InjectMessageDto {

    @ApiProperty({ description: SwaggerMessages.injectMessageDto.promptDescription(), example: `Let's change topic to astronomy!` })
    @IsString()
    prompt: string;

    @ApiProperty({ description: SwaggerMessages.injectMessageDto.modeDescription(), example: `MERGE` })
    @IsString()
    @IsIn([`MERGE`, `REPLACE`])
    mode: InjectionMode;

    @ApiProperty({ description: SwaggerMessages.injectMessageDto.botIdDescription(), example: 1 })
    @IsNumber()
    @IsIn([1, 2])
    botId: number;

    @ApiProperty({ description: SwaggerMessages.injectMessageDto.usernameDescription(), example: `Miguel` })
    @IsString()
    username: string;

}
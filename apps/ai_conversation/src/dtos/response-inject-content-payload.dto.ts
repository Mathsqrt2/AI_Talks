import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { SwaggerMessages } from "../constants/swagger.descriptions";

export class ResponseInjectContentPayloadDto {

    @ApiProperty({ description: SwaggerMessages.responseInjectDto.promptDescription(), example: "Let's talk about AI." })
    @IsString()
    prompt: string;

    @ApiProperty({ description: SwaggerMessages.responseInjectDto.modeDescription(), example: `MERGE` })
    @IsString()
    mode: string;

    @ApiProperty({ description: SwaggerMessages.responseInjectDto.botIdDescription(), example: 1 })
    @IsString()
    botId: number;

    @ApiProperty({ description: SwaggerMessages.responseInjectDto.usernameDescription(), example: `Miguel` })
    @IsString()
    username: string;

}
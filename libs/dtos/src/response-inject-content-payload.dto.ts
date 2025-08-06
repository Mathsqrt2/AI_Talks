import { IsDefined, IsEnum, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { InjectionModeEnum } from "@libs/enums";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseInjectContentPayloadDto {

    @ApiProperty({ description: SwaggerMessages.responseInjectDto.promptDescription(), example: "Let's talk about AI." })
    @IsDefined()
    @IsString()
    public prompt: string;

    @ApiProperty({ description: SwaggerMessages.responseInjectDto.modeDescription(), example: InjectionModeEnum.MERGE })
    @IsDefined()
    @IsEnum(InjectionModeEnum)
    public mode: InjectionModeEnum;
    
    @ApiProperty({ description: SwaggerMessages.responseInjectDto.botIdDescription(), example: 1 })
    @IsDefined()
    @IsString()
    public botId: number;
    
    @ApiProperty({ description: SwaggerMessages.responseInjectDto.usernameDescription(), example: `Miguel` })
    @IsDefined()
    @IsString()
    public username: string;

}
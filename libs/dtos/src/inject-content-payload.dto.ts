import { IsDefined, IsEnum, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { InjectionModeEnum } from "@libs/enums";
import { ApiProperty } from "@nestjs/swagger";

export class InjectContentPayloadDto {

    @ApiProperty({ description: SwaggerMessages.injectDto.promptDescription(), example: "Let's talk about AI." })
    @IsDefined()
    @IsString()
    public prompt: string;

    @ApiProperty({ description: SwaggerMessages.injectDto.modeDescription(), example: InjectionModeEnum.MERGE })
    @IsDefined()
    @IsEnum(InjectionModeEnum)
    public mode: InjectionModeEnum;
    
    @ApiProperty({ description: SwaggerMessages.injectDto.botIdDescription(), example: 1 })
    @IsDefined()
    @IsString()
    public botId: number;
    
    @ApiProperty({ description: SwaggerMessages.injectDto.usernameDescription(), example: `Miguel` })
    @IsDefined()
    @IsString()
    public username: string;

}
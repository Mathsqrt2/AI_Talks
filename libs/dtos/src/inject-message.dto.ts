import { IsDefined, IsEnum, IsIn, IsNumber, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { InjectionModeEnum } from "@libs/enums";
import { ApiProperty } from "@nestjs/swagger";

export class InjectMessageDto {

    @ApiProperty({ description: SwaggerMessages.injectMessageDto.promptDescription(), example: `Let's change topic to astronomy!` })
    @IsDefined()
    @IsString()
    public prompt: string;

    @ApiProperty({ description: SwaggerMessages.injectMessageDto.modeDescription(), example: InjectionModeEnum.MERGE })
    @IsDefined()
    @IsEnum(InjectionModeEnum)
    public mode: InjectionModeEnum;

    @ApiProperty({ description: SwaggerMessages.injectMessageDto.botIdDescription(), example: 1 })
    @IsDefined()
    @IsNumber()
    @IsIn([1, 2])
    public botId: number;

    @ApiProperty({ description: SwaggerMessages.injectMessageDto.usernameDescription(), example: `Miguel` })
    @IsDefined()
    @IsString()
    public username: string;

}
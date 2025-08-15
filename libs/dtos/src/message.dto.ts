import { IsDate, IsDefined, IsEnum, IsNumber, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { BotsEnum } from "@libs/enums";

export class MessageDto {

    @ApiProperty({ description: SwaggerMessages.messageDto.generationTimeDescription(), example: 420 })
    @IsDefined()
    @IsNumber()
    public generationTime: number;

    @ApiProperty({ description: SwaggerMessages.messageDto.generatingStartTimeDescription(), example: new Date().toISOString() })
    @IsDefined()
    @IsDate()
    public generatingStartTime: Date;

    @ApiProperty({ description: SwaggerMessages.messageDto.generatingEndTimeDescription(), example: new Date().toISOString() })
    @IsDefined()
    @IsDate()
    public generatingEndTime: Date;

    @ApiProperty({ description: SwaggerMessages.messageDto.contentDescription(), example: "Hello, world!" })
    @IsDefined()
    @IsString()
    public content: string;

    @ApiProperty({ description: SwaggerMessages.messageDto.authorDescription(), example: BotsEnum.BOT_1 })
    @IsDefined()
    @IsEnum(BotsEnum)
    public author: BotsEnum;

    @ApiProperty({ description: SwaggerMessages.messageDto.uuidDescription(), example: "0a44b8b588aaea880e339b35eb3abf06acb1a20cbe431e7f00a12588bafba9fb" })
    @IsString()
    @IsDefined()
    public uuid: string;
}
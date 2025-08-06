import { IsDate, IsDefined, IsEnum, IsNumber, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { BotsEnum } from "@libs/enums";

export class ResponseMessageDto {

    @ApiProperty({ description: SwaggerMessages.responseMessageDto.generationTimeDescription(), example: 420 })
    @IsDefined()
    @IsNumber()
    public generationTime: number;
    
    @ApiProperty({ description: SwaggerMessages.responseMessageDto.generatingStartTimeDescription(), example: new Date().toISOString() })
    @IsDefined()
    @IsDate()
    public generatingStartTime: Date;
    
    @ApiProperty({ description: SwaggerMessages.responseMessageDto.generatingEndTimeDescription(), example: new Date().toISOString() })
    @IsDefined()
    @IsDate()
    public generatingEndTime: Date;
    
    @ApiProperty({ description: SwaggerMessages.responseMessageDto.contentDescription(), example: "Hello, world!" })
    @IsDefined()
    @IsString()
    public content: string;
    
    @ApiProperty({ description: SwaggerMessages.responseMessageDto.authorDescription(), example: BotsEnum.BOT_1 })
    @IsDefined()
    @IsEnum(BotsEnum)
    public author: BotsEnum;
}
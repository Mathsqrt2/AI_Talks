import { IsDate, IsDefined, IsNumber, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { Bot } from "@libs/types";

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
    
    @ApiProperty({ description: SwaggerMessages.responseMessageDto.authorDescription(), example: "bot_1" })
    @IsDefined()
    @IsString()
    public author: Bot;
}
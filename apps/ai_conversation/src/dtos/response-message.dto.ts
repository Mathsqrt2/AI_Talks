import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";
import { SwaggerMessages } from "../constants/swagger.descriptions";

export class ResponseMessageDto {

    @ApiProperty({ description: SwaggerMessages.responseMessageDto.generationTimeDescription(), example: 420 })
    @IsNumber()
    generationTime: number;

    @ApiProperty({ description: SwaggerMessages.responseMessageDto.generatingStartTimeDescription(), example: new Date().toISOString() })
    @IsDate()
    generatingStartTime: Date;

    @ApiProperty({ description: SwaggerMessages.responseMessageDto.generatingEndTimeDescription(), example: new Date().toISOString() })
    @IsDate()
    generatingEndTime: Date;

    @ApiProperty({ description: SwaggerMessages.responseMessageDto.contentDescription(), example: "Hello, world!" })
    @IsString()
    content: string;

    @ApiProperty({ description: SwaggerMessages.responseMessageDto.authorDescription(), example: "System" })
    @IsString()
    author: string;
}
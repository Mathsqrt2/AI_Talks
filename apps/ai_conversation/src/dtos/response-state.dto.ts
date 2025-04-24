import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ResponseInjectContentPayloadDto } from "./response-inject-content-payload.dto";
import { SwaggerMessages } from "../constants/swagger.descriptions";
import { ResponseMessageDto } from "./response-message.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ResponseStateDto {

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: true })
    @IsBoolean()
    shouldContinue: boolean;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: false })
    @IsBoolean()
    shouldSendToTelegram: boolean;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: false })
    @IsBoolean()
    shouldDisplayResponse: boolean;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: true })
    @IsBoolean()
    shouldLog: boolean;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: "Switch the topic to AI innovations!" })
    @IsString()
    enqueuedMessage: ResponseMessageDto;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: [{ prompt: "Discuss the latest tech trends", mode: "MERGE", botId: 1, username: "alice" }] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponseInjectContentPayloadDto)
    usersMessagesStackForBot1: ResponseInjectContentPayloadDto[];

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: [{ prompt: "Discuss the latest tech trends", mode: "MERGE", botId: 1, username: "alice" }] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponseInjectContentPayloadDto)
    usersMessagesStackForBot2: ResponseInjectContentPayloadDto[];

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: 100 })
    @IsNumber()
    currentMessageIndex: number;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: [{ generationTime: 150, generatingStartTime: new Date().toISOString(), generatingEndTime: new Date().toISOString(), content: "Sure, let's go on!", author: "Bot" }] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponseMessageDto)
    lastBotMessages: ResponseMessageDto[];

    @ApiProperty({ description: `` })
    @IsBoolean()
    @IsOptional()
    isConversationInProgress?: boolean;

}
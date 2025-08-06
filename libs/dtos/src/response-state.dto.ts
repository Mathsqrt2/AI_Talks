import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ResponseInjectContentPayloadDto, ResponseMessageDto } from "./dtos";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ResponseStateDto {

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: true, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldContinue: boolean;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: false, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldSendToTelegram: boolean;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: false, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldDisplayResponse: boolean;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: true, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldLog: boolean;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: "Switch the topic to AI innovations!", required: false })
    @IsOptional()
    @IsString()
    public enqueuedMessage: ResponseMessageDto;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: [{ prompt: "Discuss the latest tech trends", mode: "MERGE", botId: 1, username: "alice" }], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponseInjectContentPayloadDto)
    public usersMessagesStackForBot1: ResponseInjectContentPayloadDto[];

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: [{ prompt: "Discuss the latest tech trends", mode: "MERGE", botId: 1, username: "alice" }], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponseInjectContentPayloadDto)
    public usersMessagesStackForBot2: ResponseInjectContentPayloadDto[];

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: 100, required: false })
    @IsOptional()
    @IsNumber()
    public currentMessageIndex: number;

    @ApiProperty({ description: SwaggerMessages.responseStateDto.shouldContinueDescription(), example: [{ generationTime: 150, generatingStartTime: new Date().toISOString(), generatingEndTime: new Date().toISOString(), content: "Sure, let's go on!", author: "Bot" }] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponseMessageDto)
    public lastBotMessages: ResponseMessageDto[];

    @ApiProperty({ description: SwaggerMessages.responseStateDto.aboutConversationInProgress(), example: true, required: false })
    @IsOptional()
    @IsBoolean()
    public isConversationInProgress?: boolean;

}
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { InjectContentPayloadDto, MessageDto } from "./dtos";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { BotsEnum } from "@libs/enums";

export class StateDto {

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldArchiveLogDescription(), example: true, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldArchiveLog: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldContinueDescription(), example: true, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldContinue: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldSendToTelegramDescription(), example: false, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldSendToTelegram: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldDisplayDescription(), example: false, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldDisplayResponse: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldBroadcastOnWebSocketDescription(), example: false, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldBroadcastOnWebSocket: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldLogDescription(), example: true, required: false })
    @IsOptional()
    @IsBoolean()
    public shouldLog: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.isGeneratingOnAirDescription(), example: false, required: false })
    @IsOptional()
    @IsBoolean()
    public isGeneratingOnAir: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.lastResponderDescription(), enum: BotsEnum, example: BotsEnum.BOT_1, required: false })
    @IsOptional()
    @IsEnum(BotsEnum)
    public lastResponder: BotsEnum;

    @ApiProperty({ description: SwaggerMessages.stateDto.enqueuedMessageDescription(), example: "Switch the topic to AI innovations!", required: false })
    @IsOptional()
    @IsString()
    public enqueuedMessage: MessageDto;

    @ApiProperty({ description: SwaggerMessages.stateDto.usersMessagesStackDescription(), example: [{ prompt: "Discuss the latest tech trends", mode: "MERGE", botId: 1, username: "alice" }], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InjectContentPayloadDto)
    public usersMessagesStackForBot1: InjectContentPayloadDto[];

    @ApiProperty({ description: SwaggerMessages.stateDto.usersMessagesStackDescription(), example: [{ prompt: "Discuss the latest tech trends", mode: "MERGE", botId: 1, username: "alice" }], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InjectContentPayloadDto)
    public usersMessagesStackForBot2: InjectContentPayloadDto[];

    @ApiProperty({ description: SwaggerMessages.stateDto.currentMessageIndexDescription(), example: 100, required: false })
    @IsOptional()
    @IsNumber()
    public currentMessageIndex: number;

    @ApiProperty({ description: SwaggerMessages.stateDto.lastBotMessagesDescription(), example: [{ generationTime: 150, generatingStartTime: new Date().toISOString(), generatingEndTime: new Date().toISOString(), content: "Sure, let's go on!", author: "Bot" }] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    public lastBotMessages: MessageDto[];

    @ApiProperty({ description: SwaggerMessages.stateDto.aboutConversationInProgress(), example: true, required: false })
    @IsOptional()
    @IsBoolean()
    public isConversationInProgress?: boolean;

}
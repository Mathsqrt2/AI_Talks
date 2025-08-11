import { IsArray, IsBoolean, IsEnum, IsNumber, IsDefined, ValidateNested } from "class-validator";
import { InjectContentPayloadDto, MessageDto } from "./dtos";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { BotsEnum } from "@libs/enums";

export class StateDto {

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldArchiveLogDescription(), example: true, required: false })
    @IsDefined()
    @IsBoolean()
    public shouldArchiveLog: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldContinueDescription(), example: true, required: false })
    @IsDefined()
    @IsBoolean()
    public shouldContinue: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldSendToTelegramDescription(), example: false, required: false })
    @IsDefined()
    @IsBoolean()
    public shouldSendToTelegram: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldDisplayDescription(), example: false, required: false })
    @IsDefined()
    @IsBoolean()
    public shouldDisplayResponse: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldBroadcastOnWebSocketDescription(), example: false, required: false })
    @IsDefined()
    @IsBoolean()
    public shouldBroadcastOnWebSocket: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.shouldLogDescription(), example: true, required: false })
    @IsDefined()
    @IsBoolean()
    public shouldLog: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.isGeneratingOnAirDescription(), example: false, required: false })
    @IsDefined()
    @IsBoolean()
    public isGeneratingOnAir: boolean;

    @ApiProperty({ description: SwaggerMessages.stateDto.lastResponderDescription(), enum: BotsEnum, example: BotsEnum.BOT_1, required: false, nullable: true })
    @IsDefined()
    @IsEnum(BotsEnum)
    public lastResponder?: BotsEnum;

    @ApiProperty({ description: SwaggerMessages.stateDto.enqueuedMessageDescription(), example: "Switch the topic to AI innovations!", required: false, nullable: true })
    @IsDefined()
    @Type(() => MessageDto)
    public enqueuedMessage?: MessageDto;

    @ApiProperty({ description: SwaggerMessages.stateDto.usersMessagesStackDescription(), example: [{ prompt: "Discuss the latest tech trends", mode: "MERGE", botId: 1, username: "alice" }], required: false })
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InjectContentPayloadDto)
    public usersMessagesStackForBot1: InjectContentPayloadDto[];

    @ApiProperty({ description: SwaggerMessages.stateDto.usersMessagesStackDescription(), example: [{ prompt: "Discuss the latest tech trends", mode: "MERGE", botId: 1, username: "alice" }], required: false })
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InjectContentPayloadDto)
    public usersMessagesStackForBot2: InjectContentPayloadDto[];

    @ApiProperty({ description: SwaggerMessages.stateDto.currentMessageIndexDescription(), example: 100, required: false })
    @IsDefined()
    @IsNumber()
    public currentMessageIndex: number;

    @ApiProperty({ description: SwaggerMessages.stateDto.lastBotMessagesDescription(), example: [{ generationTime: 150, generatingStartTime: new Date().toISOString(), generatingEndTime: new Date().toISOString(), content: "Sure, let's go on!", author: "Bot" }] })
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    public lastBotMessages: MessageDto[];

    @ApiProperty({ description: SwaggerMessages.stateDto.aboutConversationInProgress(), example: true, required: false, nullable: true })
    @IsDefined()
    @IsBoolean()
    public isConversationInProgress?: boolean;

}
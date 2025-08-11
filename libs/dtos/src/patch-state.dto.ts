import { IsBoolean, IsEnum, IsObject, IsOptional, ValidateNested } from "class-validator";
import { InjectContentPayloadDto } from "./inject-content-payload.dto";
import { Type } from "class-transformer";
import { MessageDto } from "./message.dto";
import { BotsEnum } from "@libs/enums";

export class PatchStateDto {

    @IsOptional()
    @IsBoolean()
    public shouldArchiveLog?: boolean;

    @IsOptional()
    @IsBoolean()
    public shouldContinue?: boolean;

    @IsOptional()
    @IsBoolean()
    public shouldSendToTelegram?: boolean;

    @IsOptional()
    @IsBoolean()
    public shouldDisplayResponse?: boolean;

    @IsOptional()
    @IsBoolean()
    public shouldBroadcastOnWebSocket?: boolean;

    @IsOptional()
    @IsBoolean()
    public shouldLog?: boolean;

    @IsOptional()
    @IsBoolean()
    public isGeneratingOnAir?: boolean;

    @IsOptional()
    @IsEnum(BotsEnum)
    public lastResponder?: BotsEnum;

    @IsOptional()
    @IsObject()
    @Type(() => MessageDto)
    public enqueuedMessage?: MessageDto;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => InjectContentPayloadDto)
    public usersMessagesStackForBot1?: InjectContentPayloadDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => InjectContentPayloadDto)
    public usersMessagesStackForBot2?: InjectContentPayloadDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    public lastBotMessages?: MessageDto[];

    @IsOptional()
    public currentMessageIndex?: number;

}
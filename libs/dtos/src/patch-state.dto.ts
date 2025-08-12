import { IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, ValidateNested } from "class-validator";
import { InjectContentPayloadDto } from "./inject-content-payload.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { SwaggerMessages } from "@libs/constants";
import { MessageDto } from "./message.dto";
import { Type } from "class-transformer";
import { BotsEnum } from "@libs/enums";


export class PatchStateDto {

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.shouldArchiveLogDescription() })
    @IsOptional()
    @IsBoolean()
    public shouldArchiveLog?: boolean;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.shouldContinueDescription() })
    @IsOptional()
    @IsBoolean()
    public shouldContinue?: boolean;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.shouldSendToTelegramDescription() })
    @IsOptional()
    @IsBoolean()
    public shouldSendToTelegram?: boolean;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.shouldDisplayResponseDescription() })
    @IsOptional()
    @IsBoolean()
    public shouldDisplayResponse?: boolean;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.shouldBroadcastOnWebSocketDescription() })
    @IsOptional()
    @IsBoolean()
    public shouldBroadcastOnWebSocket?: boolean;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.shouldLogDescription() })
    @IsOptional()
    @IsBoolean()
    public shouldLog?: boolean;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.isGeneratingOnAirDescription() })
    @IsOptional()
    @IsBoolean()
    public isGeneratingOnAir?: boolean;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.lastResponderDescription(), enum: BotsEnum })
    @IsOptional()
    @IsEnum(BotsEnum)
    public lastResponder?: BotsEnum;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.enqueuedMessageDescription(), type: () => MessageDto })
    @IsOptional()
    @IsObject()
    @Type(() => MessageDto)
    public enqueuedMessage?: MessageDto;

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.usersMessagesStackForBot1Description(), type: () => InjectContentPayloadDto, isArray: true })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => InjectContentPayloadDto)
    public usersMessagesStackForBot1?: InjectContentPayloadDto[];

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.usersMessagesStackForBot2Description(), type: () => InjectContentPayloadDto, isArray: true })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => InjectContentPayloadDto)
    public usersMessagesStackForBot2?: InjectContentPayloadDto[];

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.lastBotMessagesDescription(), type: () => MessageDto, isArray: true })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    public lastBotMessages?: MessageDto[];

    @ApiPropertyOptional({ description: SwaggerMessages.PatchStateDto.currentMessageIndexDescription(), example: 42 })
    @IsOptional()
    @IsNumber()
    public currentMessageIndex?: number;

}

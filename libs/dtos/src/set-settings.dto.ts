import { IsBoolean, IsDefined, IsNumber, IsPositive, IsString } from "class-validator";

export class SetSettingsDto {

    @IsDefined()
    @IsString()
    public conversationName: string;

    @IsDefined()
    @IsNumber()
    @IsPositive()
    public conversationId: number;

    @IsDefined()
    @IsBoolean()
    public isConversationInProgres: boolean;

    @IsDefined()
    @IsNumber()
    @IsPositive()
    public maxMessagesCount: number;

    @IsDefined()
    @IsNumber()
    @IsPositive()
    public maxContextSize: number;

    @IsDefined()
    @IsNumber()
    @IsPositive()
    public maxAttempts: number;

    @IsDefined()
    @IsNumber()
    @IsPositive()
    public retryAfterTimeInMiliseconds: number;

    @IsDefined()
    @IsNumber()
    @IsPositive()
    public state: unknown;
    public prompts: unknown;

}
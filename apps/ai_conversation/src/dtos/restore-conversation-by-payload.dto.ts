import { IsDefined, IsString } from "class-validator";

export class RestoreConversationPayloadDto {

    @IsDefined()
    @IsString()
    id: string;

}
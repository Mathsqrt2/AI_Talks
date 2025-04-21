import { IsDefined, IsString } from "class-validator";

export class RestoreConversationByIdDto {

    @IsDefined()
    @IsString()
    id: string;

}
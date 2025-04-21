import { IsDefined, IsIn, IsOptional, IsString } from "class-validator";

export class PromptIdDto {

    @IsOptional()
    @IsString()
    @IsIn([`0`, `1`, `2`, `3`, `4`, `5`])
    id: string;

}
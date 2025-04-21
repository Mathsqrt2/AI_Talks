import { IsIn, IsOptional, IsString } from "class-validator";

export class ModelFileIdDto {

    @IsOptional()
    @IsString()
    @IsIn([`0`, `1`, `2`])
    id: string;

}
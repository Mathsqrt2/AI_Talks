import { IsDefined, IsNumber, IsPositive, Max, Min } from "class-validator";

export class UpdateContextDto {

    @IsDefined()
    @IsNumber()
    @IsPositive()
    @Max(4096)
    @Min(0)
    context: number;
}
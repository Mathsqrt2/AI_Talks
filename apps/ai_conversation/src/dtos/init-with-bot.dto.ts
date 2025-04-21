import { IsDefined, IsIn } from "class-validator";

export class InitDto {

    @IsDefined()
    @IsIn([`1`, `2`])
    id: string;

}
import { IsEnum, IsOptional } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";
import { ModelfilesEnum } from "@libs/enums";

export class ModelFileIdDto {

    @ApiProperty({ description: SwaggerMessages.modelfileDto.aboutId(), enum: ModelfilesEnum, example: ModelfilesEnum.SPEAKER, required: false })
    @IsOptional()
    @IsEnum(ModelfilesEnum)
    modelfile: ModelfilesEnum;

}
import { SettingsPropertiesEnum } from "@libs/enums/settings-properties.enum";
import { IsDefined, IsEnum } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class SettingsPropertyDto {

    @ApiProperty({ description: SwaggerMessages.stateDto.aboutProperty(), enum: SettingsPropertiesEnum, example: SettingsPropertiesEnum.CONVERSATION_ID })
    @IsDefined()
    @IsEnum(SettingsPropertiesEnum)
    public property: SettingsPropertiesEnum;

}
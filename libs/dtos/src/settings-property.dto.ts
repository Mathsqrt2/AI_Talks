import { SettingsPropertiesEnum } from "@libs/enums/settings-properties.enum";
import { IsDefined, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SettingsPropertyDto {

    @ApiProperty({ description: "The property to retrieve from settings", enum: SettingsPropertiesEnum, example: SettingsPropertiesEnum.CONVERSATION_ID })
    @IsDefined()
    @IsEnum(SettingsPropertiesEnum)
    public property: SettingsPropertiesEnum;

}
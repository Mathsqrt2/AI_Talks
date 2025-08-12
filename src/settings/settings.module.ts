import { SettingsModule as CoreAppSettingsModule } from "@libs/settings";
import { SettingsController } from "./settings.controller";
import { LoggerModule } from "@libs/logger";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        CoreAppSettingsModule,
        LoggerModule,
    ],
    controllers: [
        SettingsController
    ],

})

export class SettingsModule { }
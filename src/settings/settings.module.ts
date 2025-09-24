import { SettingsModule as CoreAppSettingsModule } from "@libs/settings";
import { SettingsController } from "./settings.controller";
import { LoggerModule } from "@libs/logger";
import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth";

@Module({
    imports: [
        LoggerModule.forFeature(SettingsController),
        CoreAppSettingsModule,
        AuthModule,
    ],
    controllers: [
        SettingsController
    ],

})

export class SettingsModule { }
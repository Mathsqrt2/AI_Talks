import { ConversationController } from "./conversation.controller";
import { ConversationWebSocket } from "./conversation.websocket";
import { ConversationService } from "./conversation.service";
import { DatabaseModule } from "@libs/database";
import { SettingsModule } from "@libs/settings";
import { TelegramModule } from "@libs/telegram";
import { LoggerModule } from "@libs/logger";
import { Module } from "@nestjs/common";
import { AiModule } from "@libs/ai";
import { AuthModule } from "src/auth";

@Module({
    imports: [
        AuthModule,
        LoggerModule.forFeature([
            ConversationService,
            ConversationController,
            ConversationWebSocket,
        ]),
        DatabaseModule,
        SettingsModule,
        TelegramModule,
        AiModule,
    ],
    controllers: [
        ConversationController
    ],
    providers: [
        ConversationService,
        ConversationWebSocket,
    ],
})

export class ConversationModule { }
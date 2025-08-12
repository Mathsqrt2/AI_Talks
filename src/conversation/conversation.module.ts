import { ConversationController } from "./conversation.controller";
import { ConversationWebSocket } from "./conversation.websocket";
import { ConversationService } from "./conversation.service";
import { DatabaseModule } from "@libs/database";
import { SettingsModule } from "@libs/settings";
import { TelegramModule } from "@libs/telegram";
import { LoggerModule } from "@libs/logger";
import { Module } from "@nestjs/common";
import { AiModule } from "@libs/ai";

@Module({
    imports: [
        DatabaseModule,
        SettingsModule,
        TelegramModule,
        LoggerModule,
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
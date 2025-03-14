import { conversationProvider } from "./entities/conversation/conversation.provider";
import { settingsProvider } from "./entities/settings/settings.provider";
import { commentProvider } from "./entities/comment/comment.provider";
import { messageProvider } from "./entities/message/message.provider";
import { logProvider } from "./entities/log/log.provider";
import { Logger, Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import * as path from 'path';
import { Log } from "./entities/log/log.entity";
import { Comment } from "./entities/comment/comment.entity";
import { Conversation } from "./entities/conversation/conversation.entity";
import { Message } from "./entities/message/message.entity";
import { Settings } from "./entities/settings/settings.entity";
import { State } from "./entities/state/state.entity";
import { LogMessage } from "apps/ai_conversation/src/constants/conversation.responses";
import { stateProvider } from "./entities/state/state.provider";

export const databaseProviders: Provider[] = [
    {
        provide: `DATA_SOURCE`,
        useFactory: async () => {
            try {
                const dataSource = new DataSource({
                    type: `mysql`,
                    host: process.env.DB_HOST,
                    port: +process.env.DB_PORT,
                    username: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                    entities: [
                        Comment, Conversation, Log, Message, Settings, State
                    ],
                    synchronize: false,
                });
                return dataSource.initialize();

            } catch (error) {
                Logger.error(LogMessage.error.onDatabaseConnectionFail(), error);
            }
        }
    },
    commentProvider,
    conversationProvider,
    logProvider,
    messageProvider,
    settingsProvider,
    stateProvider,
]
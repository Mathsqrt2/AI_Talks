import { conversationProvider } from "./entities/conversation/conversation.provider";
import { settingsProvider } from "./entities/settings/settings.provider";
import { commentProvider } from "./entities/comment/comment.provider";
import { messageProvider } from "./entities/message/message.provider";
import { logProvider } from "./entities/log/log.provider";
import { Logger, Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DatabaseService } from "./database.service";

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
                    entities: [
                        `${__dirname}/../**/*.entity{.ts,.js}`
                    ],
                    synchronize: true,
                });
                return dataSource.initialize();

            } catch (error) {
                Logger.error(`Failed to initalize database connection.`, error);
            }
        }
    },
    DatabaseService,
    commentProvider,
    conversationProvider,
    logProvider,
    messageProvider,
    settingsProvider,
]
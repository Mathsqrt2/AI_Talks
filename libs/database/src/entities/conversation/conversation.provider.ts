import { Conversation } from "./conversation.entity";
import { DataSource } from "typeorm";

export const conversationProvider = {
    provide: `CONVERSATION`,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Conversation),
    inject: [`DATA_SOURCE`],
}
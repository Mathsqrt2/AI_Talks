import { DataSource } from "typeorm";
import { Conversation } from "./conversation.entity";


export const conversationProvider = {
    provide: `CONVERSATION`,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Conversation),
    inject: [`DATA_SOURCE`],
}
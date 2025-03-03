import { Message } from "./message.entity";
import { DataSource } from "typeorm";

export const messageProvider = {
    provide: `MESSAGE`,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
    inject: [`DATA_SOURCE`],
}
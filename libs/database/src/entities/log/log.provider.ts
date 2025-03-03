import { DataSource } from "typeorm";
import { Log } from "./log.entity";

export const logProvider = {
    provide: `LOG`,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Log),
    inject: [`DATA_SOURCE`],
}
import { Settings } from "./settings.entity";
import { DataSource } from "typeorm";

export const settingsProvider = {
    provide: `SETTINGS`,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Settings),
    inject: [`DATA_SOURCE`],
}
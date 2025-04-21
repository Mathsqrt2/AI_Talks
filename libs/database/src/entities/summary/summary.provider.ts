import { Summary } from "./summary.entity";
import { DataSource } from "typeorm";

export const summaryProvider = {
    provide: `SUMMARY`,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Summary),
    inject: [`DATA_SOURCE`],
}
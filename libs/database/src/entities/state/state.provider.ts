import { State } from "./state.entity";
import { DataSource } from "typeorm";

export const stateProvider = {
    provide: `STATE`,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(State),
    inject: [`DATA_SOURCE`],
}
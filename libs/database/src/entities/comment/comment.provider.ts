import { Comment } from "./comment.entity";
import { DataSource } from "typeorm";

export const commentProvider = {
    provide: `COMMENT`,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Comment),
    inject: [`DATA_SOURCE`],
}
import { BasicPropertiesEntity } from "./basic-properties.entity";
import { Column } from "typeorm";

export class ConversationSubproperty extends BasicPropertiesEntity {

    @Column({ type: `int`, select: false, nullable: true, default: null })
    public conversationId: number;

}
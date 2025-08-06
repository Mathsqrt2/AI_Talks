import { BaiscPropertiesEntity } from "../entities";
import { Column } from "typeorm";

export class ConversationSubproperty extends BaiscPropertiesEntity {

    @Column({ type: `int`, select: false, nullable: true, default: null })
    public conversationId: number;

}
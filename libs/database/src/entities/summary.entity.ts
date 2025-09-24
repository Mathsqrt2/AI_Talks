import { JoinColumn, Column, Entity, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { ConversationEntity } from "./conversation.entity";

@Entity(`summaries`)
export class SummaryEntity extends ConversationSubproperty {

    @ManyToOne(() => ConversationEntity, conversation => conversation.summaries)
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: ConversationEntity;

    @Column({ type: `text` })
    public content: string;

}
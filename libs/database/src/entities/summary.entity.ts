import { JoinColumn, Column, Entity, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { Conversation } from "./conversation.entity";

@Entity(`summaries`)
export class Summary extends ConversationSubproperty {

    @ManyToOne(() => Conversation, conversation => conversation.summaries)
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: Conversation;

    @Column({ type: `text` })
    public content: string;

}
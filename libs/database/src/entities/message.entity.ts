import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { Conversation } from "./conversation.entity";

@Entity(`messages`)
export class Message extends ConversationSubproperty {

    @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: `CASCADE` })
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: Conversation;

    @Column({ type: `varchar`, length: 32 })
    public author: string;

    @Column({ type: `text`, nullable: false })
    public content: string;

    @Column({ type: `bigint`, nullable: false })
    public generationTime: number;

    @Column({ type: `datetime`, nullable: false })
    public generatingStartTime: Date;

    @Column({ type: `datetime`, nullable: false })
    public generatingEndTime: Date;

}
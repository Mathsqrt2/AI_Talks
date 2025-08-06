import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { Conversation } from "./conversation.entity";

@Entity(`comments`)
export class Comment extends ConversationSubproperty {

    @ManyToOne(() => Conversation, conversation => conversation.comments)
    @JoinColumn({ name: `conversationId`, referencedColumnName: `id` })
    assignedConversation: Conversation;

    @Column({ type: `varchar`, length: 128 })
    mode: string;

    @Column({ type: `int` })
    botId: number;

    @Column({ type: "varchar", length: 256 })
    username: string;

}
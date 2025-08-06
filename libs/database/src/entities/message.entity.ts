import { BaiscPropertiesEntity, Conversation } from "./entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity(`messages`)
export class Message extends BaiscPropertiesEntity {

    @Column({ type: `int`, select: false })
    conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments, { onDelete: `CASCADE` })
    @JoinColumn({ name: `conversationId` })
    assignedConversation: Conversation;

    @Column({ type: `varchar`, length: 32 })
    author: string;

    @Column({ type: `text` })
    content: string;

    @Column({ type: `bigint` })
    generationTime: number;

    @Column({ type: `bigint` })
    generatingStartTime: number;

    @Column({ type: `bigint` })
    generatingEndTime: number;

}
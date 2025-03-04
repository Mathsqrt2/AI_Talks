import { Conversation } from "../conversation/conversation.entity";
import {
    Column, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `int`, select: false })
    conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments)
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

    @Column({ type: `bigint` })
    created_at: number;

}
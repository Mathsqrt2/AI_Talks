import { Conversation } from "./conversation.entity";
import {
    Column, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

@Entity({ name: 'logs' })
export class Log {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `text` })
    content: string;

    @Column({ type: `text`, nullable: true })
    error?: string;

    @Column({ type: `varchar`, nullable: true, length: 256 })
    label?: string;

    @Column({ type: `varchar`, nullable: true, length: 128 })
    tag?: string;

    @Column({ type: `int`, select: false, nullable: true })
    conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments)
    @JoinColumn({ name: `conversationId` })
    assignedConversation: Conversation;

    @Column({ type: `bigint` })
    createdAt: number;
}
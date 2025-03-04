import { Conversation } from "../conversation/conversation.entity";
import {
    Column, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Settings {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `int`, select: false })
    conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments)
    @JoinColumn({ name: `conversationId` })
    assignedConversation: Conversation;

    @Column({ type: `int`, nullable: true })
    maxMessagesCount: number;

    @Column({ type: `int`, nullable: true })
    maxContextSize: number;

    @Column({ type: `int`, nullable: true })
    maxAttempts: number;

    @Column({ type: `int`, nullable: true })
    retryAfterTimeInMiliseconds: number;

    @Column({ type: `varchar`, nullable: true, length: 128 })
    tag: string;

    @Column({ type: `bigint` })
    createdAt: number;

}
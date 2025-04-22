import { Conversation } from "./conversation.entity";
import {
    Column, CreateDateColumn, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

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

    @CreateDateColumn({ type: `datetime`, precision: 0 })
    createdAt: Date;

    @UpdateDateColumn({ type: `datetime`, precision: 0, default: null })
    updatedAt?: Date;

}
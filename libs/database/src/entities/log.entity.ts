import { Conversation } from "./conversation.entity";
import {
    Column, CreateDateColumn, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
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

    @ManyToOne(() => Conversation, conversation => conversation.comments, { onDelete: `CASCADE` })
    @JoinColumn({ name: `conversationId` })
    assignedConversation: Conversation;

    @CreateDateColumn({ type: `datetime`, precision: 0 })
    createdAt: Date;

    @UpdateDateColumn({ type: `datetime`, precision: 0, default: null })
    updatedAt?: Date;


}
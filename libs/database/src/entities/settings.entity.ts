import { Conversation } from "./conversation.entity";
import {
    Column, CreateDateColumn, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class Settings {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `int`, nullable: true, select: false })
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

    @CreateDateColumn({ type: `datetime`, precision: 0 })
    createdAt: Date;

    @UpdateDateColumn({ type: `datetime`, precision: 0, default: null })
    updatedAt?: Date;

}
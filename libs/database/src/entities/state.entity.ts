import { Conversation } from "./conversation.entity";
import {
    PrimaryGeneratedColumn, JoinColumn,
    Column, Entity, ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

@Entity()
export class State {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `int`, select: false })
    conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments)
    @JoinColumn({ name: `conversationId` })
    assignedConversation: Conversation;

    @Column({ type: `boolean`, nullable: true })
    shouldContinue: boolean;

    @Column({ type: `boolean`, nullable: true })
    shouldSendToTelegram: boolean;

    @Column({ type: `boolean`, nullable: true })
    shouldDisplayResponse: boolean;

    @Column({ type: `boolean`, nullable: true })
    shouldLog: boolean;

    @Column({ type: `boolean`, nullable: true })
    isGeneratingOnAir: boolean;

    @Column({ type: `varchar`, nullable: true, length: 256 })
    lastResponderName: string;

    @Column({ type: `text`, nullable: true })
    enqueuedMessageContent: string;

    @Column({ type: `varchar`, nullable: true, length: 256 })
    enqueuedMessageAuthor: string;

    @Column({ type: `int` })
    currentMessageIndex: number;

    @CreateDateColumn({ type: `datetime`, precision: 0 })
    createdAt: Date;

    @UpdateDateColumn({ type: `datetime`, precision: 0, default: null })
    updatedAt?: Date;

}
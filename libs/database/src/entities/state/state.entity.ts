import { Conversation } from "../conversation/conversation.entity";
import {
    PrimaryGeneratedColumn, JoinColumn,
    Column, Entity, ManyToOne,
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

    @Column({ type: `bigint` })
    createdAt: number;

}
import { ConversationSubproperty, Conversation } from "./entities";
import { JoinColumn, Column, Entity, ManyToOne } from "typeorm";

@Entity(`states`)
export class State extends ConversationSubproperty {

    @ManyToOne(() => Conversation, conversation => conversation.states)
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: Conversation;

    @Column({ type: `boolean`, nullable: true })
    public shouldContinue: boolean;

    @Column({ type: `boolean`, nullable: true })
    public shouldSendToTelegram: boolean;

    @Column({ type: `boolean`, nullable: true })
    public shouldDisplayResponse: boolean;

    @Column({ type: `boolean`, nullable: true })
    public shouldBroadcastOnWebSocket: boolean;

    @Column({ type: `boolean`, nullable: true })
    public shouldLog: boolean;

    @Column({ type: `boolean`, nullable: true })
    public isGeneratingOnAir: boolean;

    @Column({ type: `varchar`, nullable: true, length: 256 })
    public lastResponderName: string;

    @Column({ type: `text`, nullable: true })
    public enqueuedMessageContent: string;

    @Column({ type: `varchar`, nullable: true, length: 256 })
    public enqueuedMessageAuthor: string;

    @Column({ type: `int` })
    public currentMessageIndex: number;

}
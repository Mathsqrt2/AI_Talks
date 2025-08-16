import { JoinColumn, Column, Entity, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { Conversation } from "./conversation.entity";
import { BotsEnum } from "@libs/enums";

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
    public shouldArchiveLog: boolean;

    @Column({ type: `boolean`, nullable: true })
    public shouldLog: boolean;

    @Column({ type: `boolean`, nullable: true })
    public isGeneratingOnAir: boolean;

    @Column({ type: `varchar`, enum: BotsEnum, nullable: true, length: 256 })
    public lastResponderName: BotsEnum;

    @Column({ type: `text`, nullable: true })
    public enqueuedMessageContent: string;

    @Column({ type: `varchar`, enum: BotsEnum, nullable: true, length: 256 })
    public enqueuedMessageAuthor: BotsEnum;

    @Column({ type: `int` })
    public currentMessageIndex: number;

}
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { Conversation } from "./conversation.entity";
import { BotsEnum } from "@libs/enums";

@Entity(`messages`)
export class Message extends ConversationSubproperty {

    @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: `CASCADE` })
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: Conversation;

    @Column({ type: `enum`, enum: BotsEnum })
    public author: BotsEnum;

    @Column({ type: `text`, nullable: false })
    public content: string;

    @Column({ type: `bigint`, nullable: false })
    public generationTime: number;

    @Column({ type: `datetime`, nullable: false })
    public generatingStartTime: Date;

    @Column({ type: `datetime`, nullable: false })
    public generatingEndTime: Date;

}
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { ConversationEntity } from "./conversation.entity";
import { BotsEnum } from "@libs/enums";

@Entity(`messages`)
export class MessageEntity extends ConversationSubproperty {

    @ManyToOne(() => ConversationEntity, conversation => conversation.messages, { onDelete: `CASCADE` })
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: ConversationEntity;

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
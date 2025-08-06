import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { Conversation } from "./conversation.entity";

@Entity(`settings`)
export class Settings extends ConversationSubproperty {

    @ManyToOne(() => Conversation, conversation => conversation.settings)
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: Conversation;

    @Column({ type: `int`, nullable: true })
    public maxMessagesCount: number;

    @Column({ type: `int`, nullable: true })
    public maxContextSize: number;

    @Column({ type: `int`, nullable: true })
    public maxAttempts: number;

    @Column({ type: `int`, nullable: true })
    public retryAfterTimeInMiliseconds: number;

}
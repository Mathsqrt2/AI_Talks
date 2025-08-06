import { ConversationSubproperty, Conversation } from "./entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

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
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { ConversationEntity } from "./conversation.entity";

@Entity(`settings`)
export class SettingsEntity extends ConversationSubproperty {

    @ManyToOne(() => ConversationEntity, conversation => conversation.settings)
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: ConversationEntity;

    @Column({ type: `int`, nullable: true })
    public maxMessagesCount: number;

    @Column({ type: `int`, nullable: true })
    public maxContextSize: number;

    @Column({ type: `int`, nullable: true })
    public maxAttempts: number;

    @Column({ type: `int`, nullable: true })
    public retryAfterTimeInMiliseconds: number;

}
import { BaiscPropertiesEntity, Conversation } from "./entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity(`settings`)
export class Settings extends BaiscPropertiesEntity {

    @Column({ type: `int`, nullable: true, select: false })
    public conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments)
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
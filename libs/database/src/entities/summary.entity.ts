import { BaiscPropertiesEntity, Conversation } from "./entities";
import { JoinColumn, Column, Entity, ManyToOne } from "typeorm";

@Entity(`summaries`)
export class Summary extends BaiscPropertiesEntity {

    @Column({ type: `int`, select: false })
    public conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments)
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: Conversation;

    @Column({ type: `text` })
    public content: string;

}
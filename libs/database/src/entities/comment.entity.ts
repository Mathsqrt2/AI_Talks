import { Conversation, BaiscPropertiesEntity } from "./entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity(`comments`)
export class Comment extends BaiscPropertiesEntity {

    @Column({ type: `int`, select: false })
    conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments)
    @JoinColumn({ name: `conversationId` })
    assignedConversation: Conversation;

    @Column({ type: `varchar`, length: 128 })
    mode: string;

    @Column({ type: `int` })
    botId: number;

    @Column({ type: "varchar", length: 256 })
    username: string;

}
import { BaiscPropertiesEntity, Conversation } from "./entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity(`logs`)
export class Log extends BaiscPropertiesEntity {

    @Column({ type: `text` })
    content: string;

    @Column({ type: `text`, nullable: true })
    error?: string;

    @Column({ type: `varchar`, nullable: true, length: 256 })
    label?: string;

    @Column({ type: `varchar`, nullable: true, length: 128 })
    tag?: string;

    @Column({ type: `int`, select: false, nullable: true })
    conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments, { onDelete: `CASCADE` })
    @JoinColumn({ name: `conversationId` })
    assignedConversation: Conversation;

}
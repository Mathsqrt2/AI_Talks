import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "../conversation/conversation.entity";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({ type: `bigint` })
    createdAt: number;

}
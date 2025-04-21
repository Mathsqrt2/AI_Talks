import { Conversation } from "../conversation/conversation.entity";
import {
    PrimaryGeneratedColumn, JoinColumn,
    Column, Entity, ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Summary {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `int`, select: false })
    conversationId: number;

    @ManyToOne(() => Conversation, conversation => conversation.comments)
    @JoinColumn({ name: `conversationId` })
    assignedConversation: Conversation;

    @Column({ type: `text` })
    content: string;

    @CreateDateColumn({ type: `timestamp` })
    createdAt: Date;

    @UpdateDateColumn({ type: `timestamp`, default: null })
    updatedAt: Date;

}
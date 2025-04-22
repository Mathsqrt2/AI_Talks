import { Conversation } from "./conversation.entity";
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

    @CreateDateColumn({ type: `datetime`, precision: 0 })
    createdAt: Date;

    @UpdateDateColumn({ type: `datetime`, precision: 0, default: null })
    updatedAt?: Date;

}
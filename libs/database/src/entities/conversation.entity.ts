import { Settings } from "./settings.entity";
import { Comment } from "./comment.entity";
import { Message } from "./message.entity";
import { State } from "./state.entity";
import { Log } from "./log.entity";
import {
    Column, CreateDateColumn, Entity, JoinColumn,
    OneToMany, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `varchar`, length: 512 })
    conversationName: string;

    @Column({ type: `text` })
    initialPrompt: string;

    @CreateDateColumn({ type: `datetime`, precision: 0 })
    createdAt: Date;

    @UpdateDateColumn({ type: `datetime`, precision: 0, default: null })
    updatedAt?: Date;

    @OneToMany(() => Comment, comment => comment.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    comments: Comment[];

    @OneToMany(() => Log, log => log.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    logs: Log[];

    @OneToMany(() => Message, message => message.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    messages: Message[];

    @OneToMany(() => Settings, settings => settings.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    settings: Settings[];

    @OneToMany(() => State, state => state.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    states: State[];

}
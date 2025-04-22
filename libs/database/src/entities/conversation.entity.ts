import { Settings } from "./settings.entity";
import { Comment } from "./comment.entity";
import { Message } from "./message.entity";
import { State } from "./state.entity";
import { Log } from "./log.entity";
import {
    Column, Entity, JoinColumn,
    OneToMany, PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `varchar`, length: 512 })
    conversationName: string;

    @Column({ type: `text` })
    initialPrompt: string;

    @Column({ type: `bigint` })
    createdAt: number;

    @OneToMany(() => Comment, comment => comment.assignedConversation)
    @JoinColumn()
    comments: Comment[];

    @OneToMany(() => Log, log => log.assignedConversation)
    @JoinColumn()
    logs: Log[];

    @OneToMany(() => Message, message => message.assignedConversation)
    @JoinColumn()
    messages: Message[];

    @OneToMany(() => Settings, settings => settings.assignedConversation)
    @JoinColumn()
    settings: Settings[];

    @OneToMany(() => State, state => state.assignedConversation)
    @JoinColumn()
    states: State[];

}
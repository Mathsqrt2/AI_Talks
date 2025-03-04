import { Settings } from "../settings/settings.entity";
import { Comment } from "../comment/comment.entity";
import { Message } from "../message/message.entity";
import { State } from "../state/state.entity";
import { Log } from "../log/log.entity";
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

    @Column()
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
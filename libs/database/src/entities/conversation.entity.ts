import { BaiscPropertiesEntity, Settings, Comment, Message, State, Log } from "./entities";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";

@Entity(`conversations`)
export class Conversation extends BaiscPropertiesEntity {

    @Column({ type: `varchar`, length: 512 })
    conversationName: string;

    @Column({ type: `text` })
    initialPrompt: string;

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
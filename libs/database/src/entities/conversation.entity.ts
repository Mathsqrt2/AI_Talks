import { BaiscPropertiesEntity, Settings, Comment, Message, State, Log, Summary } from "./entities";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";

@Entity(`conversations`)
export class Conversation extends BaiscPropertiesEntity {

    @Column({ type: `varchar`, length: 512 })
    public conversationName: string;

    @Column({ type: `text` })
    public initialPrompt: string;

    @OneToMany(() => Comment, comment => comment.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public comments: Comment[];

    @OneToMany(() => Log, log => log.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public logs: Log[];

    @OneToMany(() => Message, message => message.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public messages: Message[];

    @OneToMany(() => Settings, settings => settings.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public settings: Settings[];

    @OneToMany(() => State, state => state.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public states: State[];

    @OneToMany(() => Summary, summary => summary.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public summaries: Summary[];

}
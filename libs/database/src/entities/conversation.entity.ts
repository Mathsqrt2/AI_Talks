import { BasicPropertiesEntity } from "./partials/basic-properties.entity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { SettingsEntity } from "./settings.entity";
import { MessageEntity } from "./message.entity";
import { SummaryEntity } from "./summary.entity";
import { CommentEntity } from "./comment.entity";
import { StateEntity } from "./state.entity";
import { LogEntity } from "./log.entity";

@Entity(`conversations`)
export class ConversationEntity extends BasicPropertiesEntity {

    @Column({ type: `varchar`, length: 512, unique: true })
    public conversationName: string;

    @Column({ type: `text` })
    public initialPrompt: string;

    @OneToMany(() => CommentEntity, comment => comment.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public comments: CommentEntity[];

    @OneToMany(() => LogEntity, log => log.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public logs: LogEntity[];

    @OneToMany(() => MessageEntity, message => message.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public messages: MessageEntity[];

    @OneToMany(() => SettingsEntity, settings => settings.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public settings: SettingsEntity[];

    @OneToMany(() => StateEntity, state => state.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public states: StateEntity[];

    @OneToMany(() => SummaryEntity, summary => summary.assignedConversation, { onDelete: `CASCADE` })
    @JoinColumn()
    public summaries: SummaryEntity[];

}
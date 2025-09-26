import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { ConversationEntity } from "./conversation.entity";

@Entity(`logs`)
export class LogEntity extends ConversationSubproperty {

    @ManyToOne(() => ConversationEntity, conversation => conversation.logs, { onDelete: `CASCADE` })
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: ConversationEntity;

    @Column({ type: `text`, nullable: true, default: null })
    public content: string;

    @Column({ type: `text`, nullable: true, default: null })
    public error?: string;

    @Column({ type: `varchar`, nullable: true, length: 256, default: null })
    public label?: string;

    @Column({ type: `varchar`, nullable: true, length: 128, default: null })
    public tag?: string;

    @Column({ type: `int`, default: null, nullable: true })
    public duration: number;

}
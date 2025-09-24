import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { ConversationEntity } from "./conversation.entity";

@Entity(`logs`)
export class LogEntity extends ConversationSubproperty {

    @ManyToOne(() => ConversationEntity, conversation => conversation.logs, { onDelete: `CASCADE` })
    @JoinColumn({ name: `conversationId` })
    public assignedConversation: ConversationEntity;

    @Column({ type: `text` })
    public content: string;

    @Column({ type: `text`, nullable: true })
    public error?: string;

    @Column({ type: `varchar`, nullable: true, length: 256 })
    public label?: string;

    @Column({ type: `varchar`, nullable: true, length: 128 })
    public tag?: string;

    @Column({ type: `int`, default: null, nullable: true })
    public duration: number;

}
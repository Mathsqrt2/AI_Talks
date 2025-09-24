import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ConversationSubproperty } from "./partials";
import { ConversationEntity } from "./conversation.entity";

@Entity(`comments`)
export class CommentEntity extends ConversationSubproperty {

    @ManyToOne(() => ConversationEntity, conversation => conversation.comments)
    @JoinColumn({ name: `conversationId`, referencedColumnName: `id` })
    assignedConversation: ConversationEntity;

    @Column({ type: `varchar`, length: 128 })
    mode: string;

    @Column({ type: `int` })
    botId: number;

    @Column({ type: "varchar", length: 256 })
    username: string;

}
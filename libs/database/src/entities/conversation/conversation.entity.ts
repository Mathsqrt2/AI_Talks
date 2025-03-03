import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `varchar`, length: 512 })
    conversationName: string;

    @Column({ type: `text` })
    initialPrompt: string;

    @Column()
    created_at: number;
}
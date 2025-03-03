import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `int` })
    conversation_id: number;

    @Column({ type: `varchar`, length: 32 })
    author: string;

    @Column({ type: `text` })
    content: string;

    @Column({ type: `bigint` })
    generationTime: number;

    @Column({ type: `bigint` })
    generatingStartTime: number;

    @Column({ type: `bigint` })
    generatingEndTime: number;

    @Column({ type: `bigint` })
    created_at: number;

}
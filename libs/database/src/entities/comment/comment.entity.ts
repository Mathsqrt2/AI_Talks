import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `int` })
    conversation_id: number;

    @Column({ type: `varchar`, length: 128 })
    mode: string;

    @Column({ type: `int` })
    botId: number;

    @Column({ type: "varchar", length: 256 })
    username: string;

    @Column()
    created_at: number;
}
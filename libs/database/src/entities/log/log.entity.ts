import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Log {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `varchar`, length: 2048 })
    content: string;

    @Column({ type: `varchar`, nullable: true, length: 256 })
    label?: string;

    @Column({ type: `int`, nullable: true })
    conversation_id?: number;

    @Column()
    created_at: number;
}
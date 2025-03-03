import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `varchar`, length: 128 })
    tag: string;

    @Column({ type: `bigint` })
    created_at: number;

    @Column({ type: `bigint` })
    updated_at: number;

}
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Log {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ nullable: true })
    label?: string;

    @Column()
    created_at: number;
}
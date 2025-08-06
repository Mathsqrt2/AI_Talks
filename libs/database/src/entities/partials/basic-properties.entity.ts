import {
    PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn,
    BeforeInsert, BeforeUpdate, Column
} from "typeorm";
import { SHA512 } from "crypto-js";

export class BaiscPropertiesEntity {

    @PrimaryGeneratedColumn({ type: `int` })
    public id: number;

    @CreateDateColumn({ type: `datetime`, })
    public createdAt: Date;

    @UpdateDateColumn({ type: `datetime`, default: null })
    public updatedAt?: Date;

    @Column({ type: `varchar`, length: 128, nullable: false })
    public initializationHash: string;

    @Column({ type: `varchar`, length: 128, nullable: false })
    public currentHash: string;

    @BeforeUpdate()
    private refreshProperties() {
        this.updatedAt = new Date();
        this.currentHash = this.currentEntityHash();
    }

    @BeforeInsert()
    private createInitialValues() {
        this.initializationHash = this.currentEntityHash();
        this.currentHash = this.currentEntityHash();
    }

    private currentEntityHash(): string {

        const currentEntity = { ...structuredClone(this) };
        delete currentEntity.createdAt;
        delete currentEntity.updatedAt;
        delete currentEntity.initializationHash;
        delete currentEntity.currentHash;

        for (const key in currentEntity) {
            const value = currentEntity[key];
            if (typeof value === `object` && value !== null && !(value instanceof Date)) {
                delete currentEntity[key];
            }
        }

        const hash = SHA512(JSON.stringify(currentEntity)).toString();
        return hash;
    }

}
import { BeforeUpdate, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaiscPropertiesEntity {

    @PrimaryGeneratedColumn({ type: `int` })
    public id: number;

    @CreateDateColumn({ type: `datetime`, })
    public createdAt: Date;

    @UpdateDateColumn({ type: `datetime`, default: null })
    public updatedAt?: Date;

    @BeforeUpdate()
    private refreshUpdatedAtProperty() {
        this.updatedAt = new Date();
    }

}
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasicPropertiesEntity } from "./partials";
import { UserEntity } from "./user.entity";

@Entity(`tokens`)
export class AuthTokenEntity extends BasicPropertiesEntity {

    @Column({ type: `varchar`, length: 512, unique: true })
    public tokenHash: string;

    @Column({ type: `varchar`, length: 512, unique: true })
    public uuid: string;

    @Column({ type: `datetime` })
    public generatedAt: Date;

    @Column({ type: `datetime`, nullable: false })
    public expiresAt: Date;

    @Column({ type: `datetime`, nullable: true, default: null })
    public revokedAt: Date;

    @Column({ type: `int` })
    public userId: number;

    @ManyToOne(() => UserEntity, user => user.tokens)
    @JoinColumn({ name: `userId` })
    public user: UserEntity;

}
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { BasicPropertiesEntity } from "./partials";
import { v4 as uuidv4 } from "uuid";
import { SHA512 } from "crypto-js";
import { AuthTokenEntity } from "./auth-token.entity";

@Entity(`users`)
export class UserEntity extends BasicPropertiesEntity {

    @Column({ type: `varchar`, length: 256, unique: true })
    public login: string;

    @Column({ type: `varchar`, length: 512, select: false })
    private password: string;

    @OneToMany(() => AuthTokenEntity, token => token.user)
    @JoinColumn()
    public tokens: AuthTokenEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
        if (this.password) {
            const salt: string = uuidv4();
            const passwordHash: string = SHA512(this.password).toString();
            const saltedHash = SHA512(`${salt}${passwordHash}`).toString();
            this.password = `${salt}$${saltedHash}`;
        }
    }

    public arePasswordsEqual(password: string): boolean {
        const [salt, saltedHash] = this.password.split(`$`);
        const passwordHash = SHA512(password).toString();
        return SHA512(`${salt}${passwordHash}`).toString() === saltedHash;
    }

}
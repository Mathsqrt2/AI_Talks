import { BaiscPropertiesEntity } from "./partials";
import { v4 as uuidv4 } from "uuid";
import { SHA512 } from "crypto-js";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";

@Entity(`users`)
export class UserEntity extends BaiscPropertiesEntity {

    @Column({ type: `varchar`, length: 256, unique: true })
    public login: string;

    @Column({ type: `varchar`, length: 512, select: false })
    private password: string;

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
        return SHA512(`${password}${salt}`).toString() === saltedHash;
    }

}
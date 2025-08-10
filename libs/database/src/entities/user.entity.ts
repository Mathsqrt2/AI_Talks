import { BaiscPropertiesEntity } from "./partials";
import { v4 as uuidv4 } from "uuid";
import { SHA512 } from "crypto-js";
import { Column } from "typeorm";


export class UserEntity extends BaiscPropertiesEntity {

    @Column({ type: `varchar`, length: 256, unique: true })
    public login: string;

    @Column({ type: `varchar`, length: 512 })
    private passwordHash: string;

    public set password(password: string) {
        const salt: string = uuidv4();
        const passwordHash: string = SHA512(password).toString();
        const saltedHash = SHA512(`${password}${salt}`).toString();
        this.passwordHash = `${salt}$${saltedHash}`;
    }

    public arePasswordsEqual(password: string): boolean {
        const [salt, saltedHash] = this.passwordHash.split(`$`);
        return SHA512(`${password}${salt}`).toString() === saltedHash;
    }

}
import { SignInDto, RefreshTokenDto, SignOutDto, SignUpDto } from "@libs/dtos";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Logger, InjectLogger } from "@libs/logger";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@libs/database";
import { JwtService } from "@nestjs/jwt";
import { JWTPayload } from "@libs/types";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private readonly user: Repository<UserEntity>,
        @InjectLogger(AuthService) private readonly logger: Logger,
        private readonly jwtService: JwtService,
    ) { }

    public async generateToken({ login, password }: SignInDto) {

        const user = await this.user.findOne({ where: { login } }).catch(e => {
            this.logger.error(`Error finding user: ${login}`, e);
            throw new UnauthorizedException(`Username or password is incorrect`);
        });

        if (!user) {
            this.logger.warn(`User not found: ${login}`);
            throw new UnauthorizedException(`Username or password is incorrect`);
        }

        if (!user.arePasswordsEqual(password)) {
            throw new UnauthorizedException(`Username or password is incorrect`);
        }

        const payload: JWTPayload = {
            userId: user.id,
            login: user.login,
            initializationHash: user.initializationHash,
            createdAt: user.createdAt.toISOString(),
            payloadGeneratedTime: new Date().toISOString(),
            payloadUUIDv4: uuidv4()
        };

        const token = await this.jwtService.sign(payload, { expiresIn: `1h`, algorithm: 'HS512' });
        const refreshToken = await this.jwtService.sign(payload, { expiresIn: `7d`, algorithm: 'HS512' });
        this.logger.log(`Generated token for user: ${login}`);

        return { token, refreshToken };

    }

    public async registerUser({ }: SignUpDto) { }

    public async removeToken({ }: SignOutDto) { }

    public async refreshToken({ }: RefreshTokenDto) { }
}
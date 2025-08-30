import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LoggerModule } from "@libs/logger";
import { DatabaseModule } from "@libs/database";

@Module({
    imports: [
        LoggerModule,
        DatabaseModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: {
                algorithm: 'HS512',
                audience: `app`,
                issuer: `auth`,
                expiresIn: '15m',
            },
        })],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService
    ],
})

export class AuthModule { }
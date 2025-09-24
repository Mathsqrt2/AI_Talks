import { ThrottlerModule } from "@nestjs/throttler";
import { AuthController } from "./auth.controller";
import { DatabaseModule } from "@libs/database";
import { AuthService } from "./auth.service";
import { LoggerModule } from "@libs/logger";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

@Module({
    imports: [
        LoggerModule.forFeature([
            AuthService,
            AuthController,
            AuthGuard,
        ]),
        DatabaseModule,
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 50,
                },
                {
                    ttl: 1000,
                    limit: 10,
                }
            ]
        }),
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
        AuthService,
        AuthGuard,
    ],
    exports: [
        LoggerModule.forFeature(AuthGuard)
    ]
})

export class AuthModule { }
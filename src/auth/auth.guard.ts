import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JWTPayload } from "@libs/types/auth.types";
import { JwtService } from "@nestjs/jwt";
import { Logger } from "@libs/logger";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly logger: Logger,
        private readonly jwtService: JwtService
    ) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {

        const startTime: number = Date.now();
        const request = context.switchToHttp().getRequest();
        if (!request.headers?.authorization) {
            this.logger.warn(`Authorization header is missing`, { startTime });
            return false;
        }

        const [method, token] = request.headers.authorization.split(" ");
        if (!method || !token) {
            this.logger.warn(`Authorization method or token is missing`, { startTime });
            return false;
        }

        if (method.toLowerCase() !== "jwt" && method !== "Bearer") {
            this.logger.warn(`Invalid authorization method: ${method}`, { startTime });
            return false;
        }

        try {

            const payload = await this.jwtService.verifyAsync<JWTPayload>(token, {
                secret: process.env.JWT_SECRET,
                algorithms: ['HS512'],
                audience: `app`,
                issuer: `auth`,
            });

            if (!payload) {
                this.logger.warn(`Invalid token`, { startTime });
                return false;
            }

            // if (Date.now() > new Date(payload).getTime()) {
            //     throw new UnauthorizedException("Token has expired");
            // }

        } catch (error) {
            this.logger.error("JWT verification failed", { error, startTime });
            throw error;
        }

        return true;
    }

}
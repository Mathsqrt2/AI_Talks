import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
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
            throw new UnauthorizedException("Authorization header is missing");
        }

        const [method, token] = request.headers.authorization.split(" ");
        if (!method || !token) {
            throw new UnauthorizedException("Authorization method or token is missing");
        }

        if (method.toLowerCase() !== "jwt" && method !== "Bearer") {
            throw new UnauthorizedException("Invalid authorization method");
        }
        
        const payload = await this.jwtService.verifyAsync(token);
        if (!payload) {
            throw new UnauthorizedException("Invalid token");
        }
        
        // try {


        // } catch (error) {
        //     this.logger.error("JWT verification failed", { error, startTime });
        //     throw error;
        // }

        return true;

    }

}
import { RefreshTokenDto } from "@libs/dtos/refresh-token.dto";
import { SignUpDto } from "@libs/dtos/sign-up.dto";
import { SignInDto } from "@libs/dtos/sign-in.dto";
import {
    Body, Controller, HttpCode, HttpStatus,
    Post, UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { SignOutDto } from "@libs/dtos/sign-out.dto";

@Controller(`v1/auth`)
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post(`signin`)
    @HttpCode(HttpStatus.OK)
    public async signIn(
        @Body() body: SignInDto
    ): Promise<void> {
        await this.authService.generateToken(body);
    }

    @Post(`signup`)
    @HttpCode(HttpStatus.OK)
    public async signUp(
        @Body() body: SignUpDto
    ): Promise<void> {
        await this.authService.registerUser(body);
    }

    @Post(`signout`)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    public async signOut(
        @Body() body: SignOutDto
    ): Promise<void> {
        await this.authService.removeToken(body);
    }

    @Post(`refresh`)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    public async refreshToken(
        @Body() body: RefreshTokenDto
    ): Promise<void> {
        await this.authService.refreshToken(body);
    }

}
import { AuthService } from "./auth.service";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

@Controller(`api/v1/auth`)
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post(`signin`)
    @HttpCode(HttpStatus.ACCEPTED)
    public async signIn(
        @Body() body
    ) {
        await this.authService.generateToken();
    }

    @Post(`signup`)
    @HttpCode(HttpStatus.ACCEPTED)
    public async signUp(
        @Body() body
    ) {
        await this.authService.registerUser();
    }

    @Post(`signout`)
    @HttpCode(HttpStatus.ACCEPTED)
    public async signOut(
        @Body() body
    ) {
        await this.authService.removeToken();
    }

    @Post(`refresh`)
    @HttpCode(HttpStatus.ACCEPTED)
    public async refreshToken(
        @Body() body
    ) {
        await this.authService.refreshToken();
    }

}
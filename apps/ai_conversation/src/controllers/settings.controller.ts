import {
    BadRequestException,
    Body, Controller, Get, HttpCode, HttpStatus,
    OnApplicationBootstrap, Param, Post
} from '@nestjs/common';
import { LogMessage } from '../constants/conversation.responses';
import { SettingsService } from '@libs/settings';
import { SettingsFile } from '@libs/types/settings';
import { Logger } from '@libs/logger';

@Controller(`setings`)
export class SettingsController implements OnApplicationBootstrap {

    private config: SettingsFile = null;
    constructor(
        private readonly settings: SettingsService,
        private readonly logger: Logger,
    ) { }

    public onApplicationBootstrap() {
        this.settings.app.subscribe((settingsFile: SettingsFile) => {
            this.config = settingsFile;
        })
    }

    private updateSettings = () => this.settings.app.next(this.config);

    @Get()
    @HttpCode(HttpStatus.FOUND)
    public findCurrentSettings() {
        this.logger.log(`Responded to user with current app configuration`);
        return this.config
    }

    @Get(`context`)
    @HttpCode(HttpStatus.FOUND)
    public findCurrentContextLength() {
        this.logger.log(`Responded to user with current context length.`);
        return this.config.maxContextSize;
    }

    @Get(`prompt/:id`)
    @HttpCode(HttpStatus.FOUND)
    public findCurrentBasePrompt(
        @Param(`id`) id: number
    ): { prompt: string[] } {

        if (id < 0 || id > 2) {
            throw new BadRequestException(`Failed to response with prompt. ID out of range`);
        }

        if (id === 0) {
            this.logger.log(`Responded to user with initial prompt.`);
            return { prompt: [this.config.prompts.initialPrompt] };
        }

        if (id === 1) {
            this.logger.log(`Responded to user with contextPrompt1.`);
            return { prompt: [this.config.prompts.contextPrompt1] };
        }

        if (id === 2) {
            this.logger.log(`Responded to user with contextPrompt2.`);
            return { prompt: [this.config.prompts.contextPrompt2] };
        }

        if (id === 3) {
            this.logger.log(`Responded to user with universalContext prompt.`);
            return { prompt: [this.config.prompts.contextPrompt] };
        }

        const prompt: string[] = [];
        for (const key in this.config.prompts) {
            prompt.push(this.config.prompts[key]);
        }

        this.logger.log(`Responded to user with all prompts.`);
        return { prompt }
    }

    @Post(`context`)
    @HttpCode(HttpStatus.OK)
    public setContextLength(
        @Body() body: { context: number },
    ): void {

        if (!body.context) {
            throw new BadRequestException(`Incorrect context value.`);
        }

        if (Number.isNaN(+body.context)) {
            throw new BadRequestException(`Context must be a number.`)
        }

        this.config.maxContextSize = body.context;
        this.updateSettings();

        this.logger.log(LogMessage.log.contextUpdated(body.context));
    }

    @Post(`prompt`)
    @HttpCode(HttpStatus.OK)
    public setContextPrompt(
        @Body() body: { prompt: string }
    ): void {

        if (!body.prompt) {
            throw new BadRequestException(`Invalid body.`);
        }

        this.config.prompts.contextPrompt = body.prompt;
        this.updateSettings();
    }

    @Post(`logs`)
    @HttpCode(HttpStatus.OK)
    public setLoggingState(
        @Body() body: { prompt: string }
    ): void {

    }

    @Post(`notifications`)
    @HttpCode(HttpStatus.OK)
    public setNotificationsState() {

    }

}
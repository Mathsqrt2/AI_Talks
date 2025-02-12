import {
    Body, Controller, Get, HttpStatus,
    OnApplicationBootstrap, Post, Res
} from '@nestjs/common';
import { Response } from 'express';
import { logMessages } from '../conversation.responses';
import { SettingsService } from '@libs/settings';
import { SettingsFile } from '@libs/types/settings';
import { InjectLogger, Logger } from '@libs/logger';

@Controller(`setings`)
export class SettingsController implements OnApplicationBootstrap {

    private config: SettingsFile = null;

    constructor(
        @InjectLogger() private readonly logger: Logger,
        private readonly settings: SettingsService,
    ) { }

    public onApplicationBootstrap() {
        this.settings.settings.subscribe((settingsFile: SettingsFile) => {
            this.config = settingsFile;
        })
    }

    private updateSettings = () => this.settings.settings.next(this.config);

    @Get()
    public findCurrentSettings() {

    }

    @Get(`context`)
    public findCurrentContextLength(
        @Res() response: Response,
    ) {
        response.status(HttpStatus.ACCEPTED).json(this.config.maxContextSize);
        this.logger.log(`Responded to user with current context length.`);
    }

    @Get(`prompt`)
    public findCurrentBasePrompt(

    ): void {

    }

    @Post(`context`)
    public setContextLength(
        @Res() response: Response,
        @Body() body: { context: number },
    ): void {

        if (!body.context) {
            response.sendStatus(HttpStatus.BAD_REQUEST);
            return;
        }

        if (Number.isNaN(+body.context)) {
            response.sendStatus(HttpStatus.BAD_REQUEST);
            return;
        }

        this.config.maxContextSize = body.context;
        this.updateSettings();

        this.logger.log(logMessages.log.contextUpdated(body.context));
        response.sendStatus(HttpStatus.ACCEPTED);
    }



    @Post(`prompt`)
    public setContextPrompt(
        @Res() response: Response,
        @Body() body: { prompt: string }
    ): void {

        if (!body.prompt) {
            response.sendStatus(HttpStatus.BAD_REQUEST);
            return;
        }

        this.config.prompts.contextPrompt = body.prompt;
        this.updateSettings();


    }

    @Post(`logs`)
    public setLoggingState(
        @Res() response: Response,
        @Body() body: { prompt: string }
    ): void {

    }

    @Post(`notifications`)
    public setNotificationsState() {

    }



}
import {
    Body, Controller, Get, HttpStatus,
    OnApplicationBootstrap, Post, Res
} from '@nestjs/common';
import { Response } from 'express';
import { logMessages } from '../constants/conversation.responses';
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
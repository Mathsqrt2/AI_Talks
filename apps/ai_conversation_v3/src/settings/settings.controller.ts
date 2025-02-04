import { Body, Controller, Get, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Response } from 'express';
import { logMessages } from '../ai_conversation_v3.responses';

@Controller(`setings`)
export class SettingsController {

    private readonly logger: Logger = new Logger(SettingsController.name);

    constructor(
        private readonly settings: SettingsService,
    ) { }

    @Get()
    public findCurrentSettings() {

    }

    @Get(`context`)
    public findCurrentContextLength(
        @Res() response: Response,
    ) {
        response.status(HttpStatus.ACCEPTED).json(this.settings.maxContextSize);
        if (this.settings.shouldLog) {
            this.logger.log(`Responded to user with current context length.`);
        }
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

        this.settings.maxContextSize = body.context;

        if (this.settings.shouldLog) {
            this.logger.log(logMessages.log.contextUpdated(body.context));
        }

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

        this.settings.contextPrompt = body.prompt;



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
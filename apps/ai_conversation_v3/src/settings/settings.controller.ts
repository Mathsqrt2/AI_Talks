import { Body, Controller, Get, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings.service';
import { Response } from 'express';

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
        response.status(HttpStatus.ACCEPTED).json(this.settings.MAX_CONTEXT_SIZE);
        if (this.settings.SHOULD_LOG) {
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

        this.settings.MAX_CONTEXT_SIZE = body.context;

        if (this.settings.SHOULD_LOG) {
            this.logger.log(`Context updated successfully. New valuie: ${body.context}`);
        }

        response.sendStatus(HttpStatus.ACCEPTED);
    }



    @Post(`prompt`)
    public setBasePrompt(

    ): void {

    }

    @Post(`logs`)
    public setLoggingState(

    ): void {

    }

    @Post(`notifications`)
    public setNotificationsState() {

    }



}
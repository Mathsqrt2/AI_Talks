import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BotInitPayload } from './types/speaker.types';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Controller()
export class AiTalksController {

    private logger: Logger = new Logger(AiTalksController.name);
    private isTalkInProgres: boolean = false;

    constructor(
        private readonly eventEmitter: EventEmitter2,
    ) { }

    @OnEvent(`conversation-break`)
    private pauseConversation() {
        this.isTalkInProgres = false;
    }

    @Get(`init/:id`)
    @Post(`init/:id`)
    public async initializeTalk(
        @Param(`id`) id: number,
        @Res() response: Response,
        @Body() body: BotInitPayload,
    ): Promise<void> {

        if (this.isTalkInProgres) {
            this.logger.error(`Failed to start new conversation. There is currently running conversation.`);
            response.sendStatus(HttpStatus.FORBIDDEN);
            return;
        }

        if (+id !== 1 && +id !== 2) {
            this.logger.error(`Failed to start conversation. Bot with ID ${id} doesn't exist.`);
            response.sendStatus(HttpStatus.NOT_FOUND);
            return;
        }

        try {

            this.isTalkInProgres = true;
            await this.eventEmitter.emitAsync(`converstaion-start`, { botId: +id, message: body.message });
            this.logger.log(`Conversation initialized.`);
            response.sendStatus(HttpStatus.OK);

        } catch (err) {

            this.logger.error(`Failed to initialize conversation.`)
            response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get(`break`)
    @Post(`break`)
    public async breakCurrentTalk(
        @Res() response: Response
    ) {

        if (!this.isTalkInProgres) {
            this.logger.error(`Failed to break. There are no currently processed talks.`);
            response.sendStatus(HttpStatus.BAD_REQUEST);
            return;
        }

        this.isTalkInProgres = false;
        this.logger.log(`Successfully broke the current talk.`);
        this.eventEmitter.emit(`conversation-break`);
        response.sendStatus(HttpStatus.OK);
    }

    @Get(`pause`)
    @Post(`pause`)
    public async pauseCurrentTalk(
        @Res() response: Response
    ) {

        if (!this.isTalkInProgres) {
            this.logger.error(`Failed to pause. Currently there are no processed talks.`);
            response.sendStatus(HttpStatus.BAD_REQUEST);
            return;
        }

        this.isTalkInProgres = false;
        this.logger.log(`Successfully paused current talk.`);
        this.eventEmitter.emit(`conversation-pause`);
        response.sendStatus(HttpStatus.OK);
    }

    @Get(`continue`)
    @Post(`continue`)
    public async continueCurrentTalk(
        @Res() response: Response
    ) {

        if (this.isTalkInProgres) {
            this.logger.error(`Failed to continue. Currently there are no processed talks.`);
            response.sendStatus(HttpStatus.BAD_REQUEST);
            return;
        }

        this.isTalkInProgres = true;
        this.logger.log(`Successfully resumed current talk.`);
        await this.eventEmitter.emitAsync(`conversation-continue`);
        response.sendStatus(HttpStatus.OK);
    }

    @Post(`inject`)
    public async injectMessage(
        @Res() response: Response
    ) {

    }
}
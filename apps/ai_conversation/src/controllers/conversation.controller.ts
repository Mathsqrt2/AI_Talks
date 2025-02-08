import { Body, Controller, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { BodyInitPayload, InjectContentPayload } from '@libs/types/conversarion';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayload } from '@libs/types/events';
import { SettingsService } from '@libs/settings';
import { logMessages } from '../conversation.responses';
import { event } from '../conversation.constants';
import { Response } from 'express';

@Controller()
export class ConversationController {

  private readonly logger: Logger = new Logger(ConversationController.name);

  constructor(
    private readonly settings: SettingsService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @Post(`init/:id`)
  public async initializeConversation(
    @Param(`id`) id: number,
    @Res() response: Response,
    @Body() body: BodyInitPayload,
  ): Promise<void> {

    if (this.settings.isConversationInProgres) {

      this.settings.shouldLog
        ? this.logger.error(logMessages.warn.onConversationAlreadyRunning()) : null;

      response.sendStatus(HttpStatus.FORBIDDEN);
      return;
    }

    if (+id !== 1 && +id !== 2) {

      this.settings.shouldLog
        ? this.logger.warn(logMessages.warn.onIdOutOfRange(id)) : null;

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    try {

      this.settings.isConversationInProgres = true;
      this.settings.shouldContinue = true;
      const eventPayload: EventPayload = { speaker_id: +id, prompt: body.prompt };
      await this.eventEmitter.emitAsync(event.startConversation, eventPayload);

      this.settings.shouldLog
        ? this.logger.log(logMessages.log.onConversationStart()) : null;

      response.sendStatus(HttpStatus.OK);
      return;

    } catch (error) {

      this.settings.shouldLog
        ? this.logger.error(logMessages.error.onConversationInitFail()) : null;

      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }
  }

  @Post(`break`)
  public async breakConversation(
    @Res() response: Response
  ): Promise<void> {

    if (!this.settings.isConversationInProgres) {

      this.settings.shouldLog ?
        this.logger.warn(logMessages.warn.onBreakMissingConversation()) : null;

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    this.settings.isConversationInProgres = false;
    this.eventEmitter.emit(event.breakConversation);

    this.settings.shouldLog
      ? this.logger.log(logMessages.log.onBreakConversation()) : null;

    response.sendStatus(HttpStatus.OK);
  }

  @Post(`pause`)
  public async pauseConversation(
    @Res() response: Response
  ): Promise<void> {

    if (!this.settings.isConversationInProgres) {

      this.settings.shouldLog
        ? this.logger.warn(logMessages.warn.onPauseMissingConversation()) : null;

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    this.settings.isConversationInProgres = false;
    this.settings.shouldContinue = false;
    this.settings.shouldLog
      ? this.logger.log(logMessages.log.onPauseConversation()) : null;

    response.sendStatus(HttpStatus.OK);
  }

  @Post(`resume`)
  public async resumeConversation(
    @Res() response: Response
  ) {

    if (this.settings.isConversationInProgres) {

      this.settings.shouldLog
        ? this.logger.warn(logMessages.warn.onResumeMissingConversation()) : null;

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    this.settings.isConversationInProgres = true;
    this.settings.shouldContinue = true;
    await this.eventEmitter.emitAsync(event.resumeConversation);

    this.settings.shouldLog
      ? this.logger.log(logMessages.log.onResumeConversation()) : null;

    response.sendStatus(HttpStatus.OK);
  }

  @Post(`inject`)
  public async injectContentIntoConversation(
    @Res() response: Response,
    @Body() body: InjectContentPayload,
  ) {

    if (!body) {

      this.settings.shouldLog
        ? this.logger.warn(logMessages.warn.onInvalidPayload()) : null


      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    if (body.mode !== `REPLACE` && body.mode !== `MERGE`) {

      this.settings.shouldLog
        ? this.logger.warn(logMessages.warn.onInvalidMode(body.mode)) : null;

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    await this.eventEmitter.emitAsync(event.injectMessage, body);

    this.settings.shouldLog
      ? this.logger.log(logMessages.log.onInjectMessage()) : null;

    response.sendStatus(HttpStatus.OK);
  }

}
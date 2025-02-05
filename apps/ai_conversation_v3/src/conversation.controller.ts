import { Body, Controller, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SettingsService } from './settings/settings.service';
import { Response } from 'express';
import { BodyInitPayload, InjectContentPayload } from '@libs/types/conversarion';
import { logMessages } from './conversation.responses';
import { event } from './conversation.constants';
import { EventPayload } from '@libs/types/events';

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

      if (this.settings.shouldLog) {
        this.logger.error(logMessages.warn.onConversationAlreadyRunning());
      }

      response.sendStatus(HttpStatus.FORBIDDEN);
      return;
    }

    if (+id !== 1 && +id !== 2) {

      if (this.settings.shouldLog) {
        this.logger.warn(logMessages.warn.onIdOutOfRange(id));
      }

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    try {

      this.settings.isConversationInProgres = true;
      this.settings.shouldContinue = true;
      const eventPayload: EventPayload = { speaker_id: +id, prompt: body.prompt };
      await this.eventEmitter.emitAsync(event.startConversation, eventPayload);

      if (this.settings.shouldLog) {
        this.logger.log(logMessages.log.onConversationStart());
      }

      response.sendStatus(HttpStatus.OK);
      return;

    } catch (error) {

      this.logger.error(logMessages.error.onConversationInitFail());
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }
  }

  @Post(`break`)
  public async breakConversation(
    @Res() response: Response
  ): Promise<void> {

    if (!this.settings.isConversationInProgres) {

      if (this.settings.shouldLog) {
        this.logger.warn(logMessages.warn.onBreakMissingConversation());
      }

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    this.settings.isConversationInProgres = false;
    this.eventEmitter.emit(event.breakConversation);

    if (this.settings.shouldLog) {
      this.logger.log(logMessages.log.onBreakConversation());
    }

    response.sendStatus(HttpStatus.OK);
  }

  @Post(`pause`)
  public async pauseConversation(
    @Res() response: Response
  ): Promise<void> {

    if (!this.settings.isConversationInProgres) {

      if (this.settings.shouldLog) {
        this.logger.warn(logMessages.warn.onPauseMissingConversation());
      }
      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;

    }

    this.settings.isConversationInProgres = false;
    await this.eventEmitter.emitAsync(event.pauseConversation)

    if (this.settings.shouldLog) {
      this.logger.log(logMessages.log.onPauseConversation());
    }
    response.sendStatus(HttpStatus.OK);

  }

  @Post(`resume`)
  public async resumeConversation(
    @Res() response: Response
  ) {

    if (this.settings.isConversationInProgres) {

      if (this.settings.shouldLog) {
        this.logger.warn(logMessages.warn.onResumeMissingConversation());
      }

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    this.settings.isConversationInProgres = true;
    await this.eventEmitter.emitAsync(event.resumeConversation);

    if (this.settings.shouldLog) {
      this.logger.log(logMessages.log.onResumeConversation());
    }
    response.sendStatus(HttpStatus.OK);
  }

  @Post(`inject`)
  public async injectContentIntoConversation(
    @Res() response: Response,
    @Body() body: InjectContentPayload,
  ) {

    if (!body) {

      if (this.settings.shouldLog) {
        this.logger.warn(logMessages.warn.onInvalidPayload());
      }

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    if (body.mode !== `REPLACE` && body.mode !== `MERGE`) {

      if (this.settings.shouldLog) {
        this.logger.warn(logMessages.warn.onInvalidMode(body.mode));
      }

      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    await this.eventEmitter.emitAsync(event.injectMessage, body);

    if (this.settings.shouldLog) {
      this.logger.log(logMessages.log.onInjectMessage())
    }

    response.sendStatus(HttpStatus.OK);
  }

}
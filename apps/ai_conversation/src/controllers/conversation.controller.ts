import { Body, Controller, HttpStatus, OnApplicationBootstrap, Param, Post, Res } from '@nestjs/common';
import { BodyInitPayload, InjectContentPayload } from '@libs/types/conversarion';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectLogger, Logger } from '@libs/logger';
import { EventPayload } from '@libs/types/events';
import { SettingsService } from '@libs/settings';
import { logMessages } from '../conversation.responses';
import { event } from '../conversation.constants';
import { Response } from 'express';
import { SettingsFile } from '@libs/types/settings';

@Controller()
export class ConversationController implements OnApplicationBootstrap {

  private config: SettingsFile = null;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
  ) { }

  public onApplicationBootstrap() {
    this.settings.settings.subscribe((settingsFile: SettingsFile) => {
      this.config = settingsFile;
    })
  }

  private updateSettings = () => this.settings.settings.next(this.config);

  @Post(`init/:id`)
  public async initializeConversation(
    @Param(`id`) id: number,
    @Res() response: Response,
    @Body() body: BodyInitPayload,
  ): Promise<void> {

    if (this.config.isConversationInProgres) {
      this.logger.error(logMessages.warn.onConversationAlreadyRunning());
      response.sendStatus(HttpStatus.FORBIDDEN);
      return;
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.warn(logMessages.warn.onIdOutOfRange(id));
      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    try {
      this.config.isConversationInProgres = true;
      this.config.state.shouldContinue = true;
      this.updateSettings();

      const eventPayload: EventPayload = { speaker_id: +id, prompt: body.prompt };
      await this.eventEmitter.emitAsync(event.startConversation, eventPayload);

      this.logger.log(logMessages.log.onConversationStart());
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

    if (!this.config.isConversationInProgres) {
      this.logger.warn(logMessages.warn.onBreakMissingConversation());
      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    this.config.isConversationInProgres = false;
    this.updateSettings();
    this.eventEmitter.emit(event.breakConversation);

    this.logger.log(logMessages.log.onBreakConversation());
    response.sendStatus(HttpStatus.OK);
  }

  @Post(`pause`)
  public async pauseConversation(
    @Res() response: Response
  ): Promise<void> {

    if (!this.config.isConversationInProgres) {
      this.logger.warn(logMessages.warn.onPauseMissingConversation());
      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    this.config.isConversationInProgres = false;
    this.config.state.shouldContinue = false;
    this.updateSettings();
    this.logger.log(logMessages.log.onPauseConversation());
    response.sendStatus(HttpStatus.OK);
  }

  @Post(`resume`)
  public async resumeConversation(
    @Res() response: Response
  ) {

    if (this.config.isConversationInProgres) {
      this.logger.warn(logMessages.warn.onResumeMissingConversation());
      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    this.config.isConversationInProgres = true;
    this.config.state.shouldContinue = true;
    this.updateSettings();
    await this.eventEmitter.emitAsync(event.resumeConversation);

    this.logger.log(logMessages.log.onResumeConversation());
    response.sendStatus(HttpStatus.OK);
  }

  @Post(`inject`)
  public async injectContentIntoConversation(
    @Res() response: Response,
    @Body() body: InjectContentPayload,
  ) {

    if (!body) {
      this.logger.warn(logMessages.warn.onInvalidPayload());
      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    if (body.mode !== `REPLACE` && body.mode !== `MERGE`) {
      this.logger.warn(logMessages.warn.onInvalidMode(body.mode));
      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    await this.eventEmitter.emitAsync(event.injectMessage, body);
    this.logger.log(logMessages.log.onInjectMessage());
    response.sendStatus(HttpStatus.OK);
  }

}
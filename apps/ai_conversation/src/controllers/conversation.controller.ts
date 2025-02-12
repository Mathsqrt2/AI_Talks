import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, InternalServerErrorException, OnApplicationBootstrap, Param, Post, Res } from '@nestjs/common';
import { BodyInitPayload, InjectContentPayload } from '@libs/types/conversarion';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectLogger, Logger } from '@libs/logger';
import { EventPayload } from '@libs/types/events';
import { SettingsService } from '@libs/settings';
import { logMessages } from '../conversation.responses';
import { event } from '../conversation.constants';
import { SettingsFile } from '@libs/types/settings';
import { InjectMessageDto } from '../dtos/injectMessageDto';

@Controller()
export class ConversationController implements OnApplicationBootstrap {

  private config: SettingsFile = null;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
  ) { }

  private updateSettings = () => this.settings.settings.next(this.config);
  public onApplicationBootstrap() {
    this.settings.settings.subscribe((settingsFile: SettingsFile) => {
      this.config = settingsFile;
    })
  }

  @Post([`init/:id`, `start/:id`, `run/:id`])
  @HttpCode(HttpStatus.ACCEPTED)
  public async initializeConversation(
    @Param(`id`) id: number,
    @Body() body: BodyInitPayload,
  ): Promise<void> {

    if (this.config.isConversationInProgres) {
      this.logger.error(logMessages.warn.onConversationAlreadyRunning());
      throw new ForbiddenException(logMessages.warn.onConversationAlreadyRunning());
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.warn(logMessages.warn.onIdOutOfRange(id));
      throw new BadRequestException(logMessages.warn.onIdOutOfRange(id))
    }

    try {
      this.config.isConversationInProgres = true;
      this.config.state.shouldContinue = true;
      this.updateSettings();

      const eventPayload: EventPayload = { speaker_id: +id, prompt: body.prompt };
      await this.eventEmitter.emitAsync(event.startConversation, eventPayload);

      this.logger.log(logMessages.log.onConversationStart());
    } catch (error) {
      this.logger.error(logMessages.error.onConversationInitFail());
      throw new InternalServerErrorException(logMessages.error.onConversationInitFail())
    }

  }

  @Post([`break`, `stop`, `end`])
  @HttpCode(HttpStatus.OK)
  public async breakConversation(): Promise<void> {

    if (!this.config.isConversationInProgres) {
      this.logger.warn(logMessages.warn.onBreakMissingConversation());
      throw new BadRequestException(logMessages.warn.onBreakMissingConversation())
    }

    this.config.isConversationInProgres = false;
    this.updateSettings();

    this.eventEmitter.emit(event.breakConversation);
    this.logger.log(logMessages.log.onBreakConversation());
  }

  @Post(`pause`)
  @HttpCode(HttpStatus.OK)
  public async pauseConversation(): Promise<void> {

    if (!this.config.isConversationInProgres) {
      this.logger.warn(logMessages.warn.onPauseMissingConversation());
      throw new BadRequestException(logMessages.warn.onPauseMissingConversation())
    }

    this.config.isConversationInProgres = false;
    this.config.state.shouldContinue = false;
    this.updateSettings();

    this.logger.log(logMessages.log.onPauseConversation());
  }

  @Post([`resume`, `continue`])
  @HttpCode(HttpStatus.OK)
  public async resumeConversation(): Promise<void> {

    if (this.config.isConversationInProgres) {
      this.logger.warn(logMessages.warn.onResumeMissingConversation());
      throw new BadRequestException(logMessages.warn.onResumeMissingConversation())
    }

    this.config.isConversationInProgres = true;
    this.config.state.shouldContinue = true;
    this.updateSettings();

    await this.eventEmitter.emitAsync(event.resumeConversation);
    this.logger.log(logMessages.log.onResumeConversation());
  }

  @Post([`inject`, `modify`])
  @HttpCode(HttpStatus.ACCEPTED)
  public async injectContentIntoConversation(
    @Body() body: InjectMessageDto,
  ): Promise<void> {

    if (!body) {
      this.logger.warn(logMessages.warn.onInvalidPayload());
      throw new BadRequestException(logMessages.warn.onInvalidPayload());
    }

    if (body.mode !== `REPLACE` && body.mode !== `MERGE`) {
      this.logger.warn(logMessages.warn.onInvalidMode(body.mode));
      throw new BadRequestException(logMessages.warn.onInvalidMode(body.mode));
    }

    await this.eventEmitter.emitAsync(event.injectMessage, body);
    this.logger.log(logMessages.log.onInjectMessage());
  }

}
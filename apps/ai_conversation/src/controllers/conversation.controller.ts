import {
  BadRequestException, Body, Controller,
  ForbiddenException, HttpCode, HttpStatus,
  InternalServerErrorException, OnApplicationBootstrap,
  Param, Post
} from '@nestjs/common';
import { BodyInitPayload } from '@libs/types/conversarion';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@libs/logger';
import { EventPayload } from '@libs/types/events';
import { SettingsService } from '@libs/settings';
import { LogMessage } from '../constants/conversation.responses';
import { event } from '../constants/conversation.constants';
import { SettingsFile } from '@libs/types/settings';
import { InjectMessageDto } from '../dtos/injectMessageDto';
import { ApiParam } from '@nestjs/swagger';
import { SwaggerMessages } from '../constants/swagger.descriptions';

@Controller()
export class ConversationController implements OnApplicationBootstrap {

  private config: SettingsFile = null;

  constructor(
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
  ) { }

  private updateSettings = () => this.settings.app.next(this.config);
  public onApplicationBootstrap() {
    this.settings.app.subscribe((settingsFile: SettingsFile) => {
      this.config = settingsFile;
    })
  }

  @Post([`init/:id`, `start/:id`, `run/:id`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiParam({ name: `id`, description: SwaggerMessages.description.aboutInitId(), required: false })
  public async initializeConversation(
    @Body() body: BodyInitPayload,
    @Param(`id`) id?: number,
  ): Promise<void> {

    if (this.config.isConversationInProgres) {
      this.logger.error(LogMessage.warn.onConversationAlreadyRunning());
      throw new ForbiddenException(LogMessage.warn.onConversationAlreadyRunning());
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.warn(LogMessage.warn.onIdOutOfRange(id));
      throw new BadRequestException(LogMessage.warn.onIdOutOfRange(id))
    }

    try {
      this.config.isConversationInProgres = true;
      this.config.state.shouldContinue = true;
      this.updateSettings();

      const eventPayload: EventPayload = { speaker_id: +id, prompt: body.prompt };
      await this.eventEmitter.emitAsync(event.startConversation, eventPayload);

      this.logger.log(LogMessage.log.onConversationStart());
    } catch (error) {
      this.logger.error(LogMessage.error.onConversationInitFail());
      throw new InternalServerErrorException(LogMessage.error.onConversationInitFail())
    }

  }

  @Post([`break`, `stop`, `end`])
  @HttpCode(HttpStatus.OK)
  public async breakConversation(): Promise<void> {

    if (!this.config.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onBreakMissingConversation());
      throw new BadRequestException(LogMessage.warn.onBreakMissingConversation())
    }

    this.config.isConversationInProgres = false;
    this.updateSettings();

    this.eventEmitter.emit(event.breakConversation);
    this.logger.log(LogMessage.log.onBreakConversation());
  }

  @Post(`pause`)
  @HttpCode(HttpStatus.OK)
  public async pauseConversation(): Promise<void> {

    if (!this.config.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onPauseMissingConversation());
      throw new BadRequestException(LogMessage.warn.onPauseMissingConversation())
    }

    this.config.isConversationInProgres = false;
    this.config.state.shouldContinue = false;
    this.updateSettings();

    this.logger.log(LogMessage.log.onPauseConversation());
  }

  @Post([`resume`, `continue`])
  @HttpCode(HttpStatus.OK)
  public async resumeConversation(): Promise<void> {

    if (!this.config.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onResumeMissingConversation());
      throw new BadRequestException(LogMessage.warn.onResumeMissingConversation())
    }

    this.config.isConversationInProgres = true;
    this.config.state.shouldContinue = true;
    this.updateSettings();

    await this.eventEmitter.emitAsync(event.resumeConversation);
    this.logger.log(LogMessage.log.onResumeConversation());
  }

  @Post([`reset`, `clear`])
  @HttpCode(HttpStatus.OK)
  public async resetConversation(): Promise<void> {

    if (!this.config.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onResumeMissingConversation());
      throw new BadRequestException(LogMessage.warn.onResumeMissingConversation())
    }

    this.config.state.shouldContinue = false;

    this.config.state.shouldNotify = false;
    this.config.state.lastBotMessages = [];
    this.config.state.currentMessageIndex = 0;

    this.config.isConversationInProgres = false

  }

  @Post([`inject`, `modify`])
  @HttpCode(HttpStatus.ACCEPTED)
  public async injectContentIntoConversation(
    @Body() body: InjectMessageDto,
  ): Promise<void> {

    if (!body) {
      this.logger.warn(LogMessage.warn.onInvalidPayload());
      throw new BadRequestException(LogMessage.warn.onInvalidPayload());
    }

    if (body.mode !== `REPLACE` && body.mode !== `MERGE`) {
      this.logger.warn(LogMessage.warn.onInvalidMode(body.mode));
      throw new BadRequestException(LogMessage.warn.onInvalidMode(body.mode));
    }

    await this.eventEmitter.emitAsync(event.injectMessage, body);
    this.logger.log(LogMessage.log.onInjectMessage());
  }

}
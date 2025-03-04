import { SwaggerMessages } from '../constants/swagger.descriptions';
import { ConversationInitDto } from '../dtos/conversation-init.dto';
import { LogMessage } from '../constants/conversation.responses';
import { MessageEventPayload } from '@libs/types/conversarion';
import { InjectMessageDto } from '../dtos/inject-message.dto';
import { event } from '../constants/conversation.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InitEventPayload } from '@libs/types/events';
import { SettingsService } from '@libs/settings';
import { Logger } from '@libs/logger';
import {
  ApiAcceptedResponse, ApiBadRequestResponse, ApiBody,
  ApiForbiddenResponse, ApiInternalServerErrorResponse,
  ApiOkResponse, ApiParam
} from '@nestjs/swagger';
import {
  BadRequestException, Body, Controller,
  ForbiddenException, Get, HttpCode, HttpStatus,
  InternalServerErrorException,
  Param, Post
} from '@nestjs/common';
import { prompts } from '../constants/prompts';

@Controller()
export class ConversationController {

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
    private readonly logger: Logger,
  ) { }

  private wait = async (timeInMiliseconds: number = 10000): Promise<void> => (
    new Promise(resolve => setTimeout(() => resolve(), timeInMiliseconds))
  );

  @Post([`init/:id`, `start/:id`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiParam({ name: `id`, description: SwaggerMessages.init.aboutIdParam(), required: true, type: Number, example: 1 })
  @ApiBody({ required: false, examples: SwaggerMessages.conversationInitDto.examples })
  @ApiAcceptedResponse({ description: SwaggerMessages.init.aboutAcceptedResponse() })
  @ApiForbiddenResponse({ description: SwaggerMessages.init.aboutForbiddenResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.init.aboutBadRequestResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.init.aboutInternalServerError() })
  public async initializeConversation(
    @Body() body: ConversationInitDto,
    @Param(`id`) id: number,
  ): Promise<void> {

    if (this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onConversationAlreadyRunning(), { save: true });
      throw new ForbiddenException(LogMessage.warn.onConversationAlreadyRunning());
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.warn(LogMessage.warn.onIdOutOfRange(id), { save: true });
      throw new BadRequestException(LogMessage.warn.onIdOutOfRange(id))
    }

    try {
      const initEventPayload: InitEventPayload = {
        speaker_id: +id,
        prompt: body?.prompt || prompts.initialPrompt,
      };
      await this.eventEmitter.emitAsync(event.startConversation, initEventPayload);
      this.logger.log(LogMessage.log.onConversationStart(), { save: true });

    } catch (error) {
      this.logger.error(LogMessage.error.onConversationInitFail(), { save: true });
      throw new InternalServerErrorException(LogMessage.error.onConversationInitFail())
    }

  }

  @Post([`pause`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.pause.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.pause.aboutOkResponse() })
  public async pauseConversation(): Promise<void> {

    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onPauseMissingConversation(), { save: true });
      throw new BadRequestException(LogMessage.warn.onPauseMissingConversation())
    }

    this.settings.app.state.shouldContinue = false;
    this.settings.noticeInterrupt(`pause`);
    this.logger.log(LogMessage.log.onPauseConversation(), { save: true });
  }

  @Post([`resume`, `continue`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.resume.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.resume.aboutOkResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.resume.aboutInternalServerError() })
  public async resumeConversation(): Promise<void> {

    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onResumeMissingConversation(), { save: true });
      throw new BadRequestException(LogMessage.warn.onResumeMissingConversation())
    }

    this.settings.app.state.shouldContinue = true;
    const payload: MessageEventPayload = {
      message: this.settings.app.state.enqueuedMessage
    };

    try {
      await this.eventEmitter.emitAsync(event.message, payload);
      this.settings.noticeInterrupt(`resume`);
      this.logger.log(LogMessage.log.onResumeConversation(), { save: true });

    } catch (error) {
      this.logger.error(LogMessage.error.onResumeConversationFail(), { save: true })
      throw new InternalServerErrorException(LogMessage.error.onResumeConversationFail());
    }

  }

  @Post([`break`, `stop`, `reset`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.break.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.break.aboutOkResponse() })
  public async breakConversation(): Promise<void> {

    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onBreakMissingConversation(), { save: true });
      throw new BadRequestException(LogMessage.warn.onBreakMissingConversation())
    }

    await this.settings.clearStats();
    this.settings.app.state.shouldContinue = false;
    this.settings.app.state.enqueuedMessage = null;
    this.settings.app.state.usersMessagesStackForBot1 = [];
    this.settings.app.state.usersMessagesStackForBot2 = [];
    this.settings.app.state.lastBotMessages = [];
    this.settings.app.state.currentMessageIndex = 0;
    this.settings.app.isConversationInProgres = false;
    this.settings.app.conversationName = null;

    this.logger.log(LogMessage.log.onBreakConversation(this.settings.app.conversationName), { save: true });
  }

  @Post([`inject`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBadRequestResponse({ description: SwaggerMessages.inject.aboutBadRequestResponse() })
  @ApiAcceptedResponse({ description: SwaggerMessages.inject.aboutAcceptedResponse() })
  public async injectContentIntoConversation(
    @Body() body: InjectMessageDto,
  ): Promise<void> {

    if (!body) {
      this.logger.warn(LogMessage.warn.onInvalidPayload(), { save: true });
      throw new BadRequestException(LogMessage.warn.onInvalidPayload());
    }

    if (body.mode !== `REPLACE` && body.mode !== `MERGE`) {
      this.logger.warn(LogMessage.warn.onInvalidMode(body.mode), { save: true });
      throw new BadRequestException(LogMessage.warn.onInvalidMode(body.mode));
    }

    body.botId === 1
      ? this.settings.app.state.usersMessagesStackForBot1.push(body)
      : this.settings.app.state.usersMessagesStackForBot2.push(body);
    this.logger.log(LogMessage.log.onInjectMessage(), { save: true });
  }

  @Get([`summary`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.summaryGeneration.aboutInternalServerError() })
  public async prepareCurrentTalkSummary() {

    let maximumAttemptsNumber: number = 12;
    if (this.settings.app.state.shouldContinue) {
      this.settings.app.state.shouldContinue = false;
    }

    while (this.settings.app.state.isGeneratingOnAir && maximumAttemptsNumber-- > 0) {
      const timeInMiliseconds = 30000;
      await this.wait(timeInMiliseconds)
    }

    if (maximumAttemptsNumber === 0) {
      throw new InternalServerErrorException(LogMessage.error.onSummaryGenerationFail());
    }

    this.settings.app.state.shouldContinue = true;
  }
}
import { EventsEnum, InjectionModeEnum, ConversationInterruptsEnum } from '@libs/enums';
import { SwaggerMessages, LogMessage, prompts } from '@libs/constants';
import { MessageEventPayload, InitEventPayload } from '@libs/types';
import {
  RestoreConversationByIdDto, InitDto, ConversationInitDto,
  InjectMessageDto, SettingsDto
} from '@libs/dtos';
import { ConversationService } from 'src/conversation/conversation.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SettingsService } from '@libs/settings';
import { Logger } from '@libs/logger';
import {
  ApiAcceptedResponse, ApiBadRequestResponse, ApiBody,
  ApiForbiddenResponse, ApiInternalServerErrorResponse,
  ApiNotFoundResponse, ApiOkResponse, ApiParam
} from '@nestjs/swagger';
import {
  BadRequestException, Body, Controller, Param, Post,
  ForbiddenException, Get, HttpCode, HttpStatus,
  InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller(`api/v1/conversation`)
@UseGuards(AuthGuard)
export class ConversationController {

  constructor(
    private readonly conversationService: ConversationService,
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
    private readonly logger: Logger,
  ) { }

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
    @Param() { id }: InitDto,
  ): Promise<void> {

    const startTime: number = Date.now();
    if (this.settings.app.isConversationInProgress) {
      this.logger.warn(LogMessage.warn.onConversationAlreadyRunning(), { startTime });
      throw new ForbiddenException(LogMessage.warn.onConversationAlreadyRunning());
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.warn(LogMessage.warn.onIdOutOfRange(id), { startTime });
      throw new BadRequestException(LogMessage.warn.onIdOutOfRange(id))
    }

    const initEventPayload: InitEventPayload = {
      speaker_id: +id,
      prompt: body?.prompt || prompts.initialPrompt,
    };

    try {

      await this.eventEmitter.emitAsync(EventsEnum.startConversation, initEventPayload);
      this.settings.app.state.currentMessageIndex++;
      this.logger.log(LogMessage.log.onConversationStart(), { startTime });

    } catch (error) {

      this.logger.error(LogMessage.error.onConversationInitFail(), { startTime });
      throw new InternalServerErrorException(LogMessage.error.onConversationInitFail())

    }

  }

  @Post([`pause`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.pause.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.pause.aboutOkResponse() })
  public async pauseConversation(): Promise<void> {

    const startTime: number = Date.now();
    if (!this.settings.app.isConversationInProgress) {
      this.logger.warn(LogMessage.warn.onPauseMissingConversation(), { startTime });
      throw new BadRequestException(LogMessage.warn.onPauseMissingConversation())
    }

    this.settings.app.state.shouldContinue = false;
    this.settings.noticeInterrupt(ConversationInterruptsEnum.PAUSE);
    this.logger.log(LogMessage.log.onPauseConversation(), { startTime });

  }

  @Post([`resume`, `continue`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.resume.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.resume.aboutOkResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.resume.aboutInternalServerError() })
  public async resumeConversation(): Promise<void> {

    const startTime: number = Date.now();
    if (!this.settings.app.isConversationInProgress) {
      this.logger.warn(LogMessage.warn.onResumeMissingConversation(), { startTime });
      throw new BadRequestException(LogMessage.warn.onResumeMissingConversation())
    }

    this.settings.app.state.shouldContinue = true;
    const payload: MessageEventPayload = {
      message: this.settings.findLastMessage(),
    };

    try {
      await this.eventEmitter.emitAsync(EventsEnum.message, payload);
      this.settings.noticeInterrupt(ConversationInterruptsEnum.RESUME);
      this.logger.log(LogMessage.log.onResumeConversation(), { startTime });

    } catch (error) {
      this.logger.error(LogMessage.error.onResumeConversationFail(), { startTime })
      throw new InternalServerErrorException(LogMessage.error.onResumeConversationFail());
    }

  }

  @Post([`break`, `stop`, `reset`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.break.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.break.aboutOkResponse() })
  public async breakConversation(): Promise<void> {

    const startTime: number = Date.now();
    if (!this.settings.app.isConversationInProgress) {
      this.logger.warn(LogMessage.warn.onBreakMissingConversation(), { startTime });
      throw new BadRequestException(LogMessage.warn.onBreakMissingConversation())
    }

    try {
      await this.conversationService.stopConversation();
    } catch (error) {
      this.logger.error(LogMessage.error.onBreakConversationFail(), { startTime, error });
      throw new InternalServerErrorException(LogMessage.error.onBreakConversationFail());
    }

  }

  @Post([`inject`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBadRequestResponse({ description: SwaggerMessages.inject.aboutBadRequestResponse() })
  @ApiAcceptedResponse({ description: SwaggerMessages.inject.aboutAcceptedResponse() })
  public async injectContentIntoConversation(
    @Body() body: InjectMessageDto,
  ): Promise<void> {

    const startTime: number = Date.now();
    if (!body) {
      this.logger.warn(LogMessage.warn.onInvalidPayload(), { startTime });
      throw new BadRequestException(LogMessage.warn.onInvalidPayload());
    }

    if (body.mode !== InjectionModeEnum.REPLACE && body.mode !== InjectionModeEnum.MERGE) {
      this.logger.warn(LogMessage.warn.onInvalidMode(body.mode), { startTime });
      throw new BadRequestException(LogMessage.warn.onInvalidMode(body.mode));
    }

    body.botId === 1
      ? this.settings.app.state.usersMessagesStackForBot1.push(body)
      : this.settings.app.state.usersMessagesStackForBot2.push(body);
    this.logger.log(LogMessage.log.onInjectMessage(), { startTime });
  }

  @Get([`summary`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.summaryGeneration.aboutInternalServerError() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.summaryGeneration.aboutInternalServerError() })
  public async prepareCurrentTalkSummary(): Promise<string> {

    const startTime: number = Date.now();

    if (this.settings.app.state.currentMessageIndex === 0 || this.settings.app.state.lastBotMessages?.length === 0) {
      throw new InternalServerErrorException(LogMessage.error.onCreateSummaryFail(this.settings.app.conversationName));
    }

    try {

      const summary = await this.conversationService.createConversationSummary();
      this.settings.app.state.isGeneratingOnAir = false;
      this.settings.app.state.shouldContinue = true;
      const payload: MessageEventPayload = {
        message: this.settings.app.state.enqueuedMessage
      };

      await this.eventEmitter.emitAsync(EventsEnum.message, payload);
      this.settings.noticeInterrupt(ConversationInterruptsEnum.RESUME);
      this.logger.log(LogMessage.log.onResumeConversation(), { startTime });
      return summary;

    } catch (error) {
      this.logger.error(LogMessage.error.onResumeConversationFail(), { startTime, error });
      throw new InternalServerErrorException(LogMessage.error.onResumeConversationFail());
    }
  }

  @Post([`restore`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.restoreConversation.ApiAcceptedResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.restoreConversation.ApiInternalServerErrorResponse() })
  @ApiForbiddenResponse({ description: SwaggerMessages.restoreConversation.ApiForbiddenResponse() })
  public async restoreConversationFromPayload(
    @Body() body: SettingsDto
  ): Promise<void> {

    const startTime: number = Date.now();
    const existingSettings = structuredClone(this.settings.app);
    if (this.settings.app.isConversationInProgress) {
      throw new ForbiddenException(LogMessage.warn.onConversationAlreadyRunning());
    }

    try {

      this.settings.app = body;
      this.settings.app.state.currentMessageIndex = body.state.lastBotMessages.length - 1;

      if (!existingSettings.isConversationInProgress && this.settings.app.isConversationInProgress) {
        const payload: MessageEventPayload = { message: this.settings.findLastMessage() };
        this.settings.app.state.shouldContinue = true;
        await this.eventEmitter.emitAsync(EventsEnum.message, payload);
      }

      this.logger.log(LogMessage.log.onConversationRestored(), { startTime });

    } catch (error) {
      this.logger.error(LogMessage.error.onConversationRestoreFail(), { startTime, error });
      throw new InternalServerErrorException(LogMessage.error.onConversationRestoreFail());
    }
  }

  @Post([`restore/:id`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.restoreConversation.ApiAcceptedResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.restoreConversation.ApiInternalServerErrorResponse() })
  @ApiForbiddenResponse({ description: SwaggerMessages.restoreConversation.ApiForbiddenResponse() })
  @ApiNotFoundResponse({ description: SwaggerMessages.restoreConversation.ApiNotFoundResponse() })
  public async restoreConversationFromDatabase(
    @Param() { id }: RestoreConversationByIdDto
  ): Promise<void> {

    const startTime: number = Date.now();
    if (this.settings.app.isConversationInProgress) {
      throw new ForbiddenException(LogMessage.warn.onConversationAlreadyRunning())
    }

    this.settings.applyConversationSettingsAndState(id);
    this.logger.log(LogMessage.log.onConversationRestored(), { startTime });

  }

  @Post([`reset`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.resetConversation.ApiAcceptedResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.resetConversation.ApiInternalServerErrorResponse() })
  public async resetConversation(): Promise<void> {

    const startTime: number = Date.now();
    this.settings.restoreDefaults();
    this.logger.log(LogMessage.log.onConversationReset(), { startTime });

  }

}
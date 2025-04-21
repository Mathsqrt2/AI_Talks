import { RestoreConversationPayloadDto } from '../dtos/restore-conversation-by-payload.dto';
import { Conversation } from '@libs/database/entities/conversation/conversation.entity';
import { RestoreConversationByIdDto } from '../dtos/restore-conversation-by-id.dto';
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
  ApiNotFoundResponse,
  ApiOkResponse, ApiParam
} from '@nestjs/swagger';
import {
  BadRequestException, Body, Controller,
  ForbiddenException, Get, HttpCode, HttpStatus,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param, Post
} from '@nestjs/common';
import { InitDto } from '../dtos/init-with-bot.dto';
import { prompts } from '../constants/prompts';
import { AiService } from '@libs/ai';
import { Repository } from 'typeorm';

@Controller()
export class ConversationController {

  constructor(
    @Inject(`CONVERSATION`) private readonly conversation: Repository<Conversation>,
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
    private readonly logger: Logger,
    private readonly ai: AiService,
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
    @Param() { id }: InitDto,
  ): Promise<void> {

    const startTime: number = Date.now();
    if (this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onConversationAlreadyRunning());
      throw new ForbiddenException(LogMessage.warn.onConversationAlreadyRunning());
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.warn(LogMessage.warn.onIdOutOfRange(id));
      throw new BadRequestException(LogMessage.warn.onIdOutOfRange(id))
    }

    const initEventPayload: InitEventPayload = {
      speaker_id: +id,
      prompt: body?.prompt || prompts.initialPrompt,
    };

    try {

      await this.eventEmitter.emitAsync(event.startConversation, initEventPayload);
      this.logger.log(LogMessage.log.onConversationStart());

    } catch (error) {

      this.logger.error(LogMessage.error.onConversationInitFail());
      throw new InternalServerErrorException(LogMessage.error.onConversationInitFail())

    }

  }

  @Post([`pause`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.pause.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.pause.aboutOkResponse() })
  public async pauseConversation(): Promise<void> {

    const startTime: number = Date.now();
    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onPauseMissingConversation());
      throw new BadRequestException(LogMessage.warn.onPauseMissingConversation())
    }

    this.settings.app.state.shouldContinue = false;
    this.settings.noticeInterrupt(`pause`);
    this.logger.log(LogMessage.log.onPauseConversation());

  }

  @Post([`resume`, `continue`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.resume.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.resume.aboutOkResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.resume.aboutInternalServerError() })
  public async resumeConversation(): Promise<void> {

    const startTime: number = Date.now();
    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onResumeMissingConversation());
      throw new BadRequestException(LogMessage.warn.onResumeMissingConversation())
    }

    this.settings.app.state.shouldContinue = true;
    const payload: MessageEventPayload = {
      message: this.settings.app.state.enqueuedMessage
    };

    try {
      await this.eventEmitter.emitAsync(event.message, payload);
      this.settings.noticeInterrupt(`resume`);
      this.logger.log(LogMessage.log.onResumeConversation());

    } catch (error) {
      this.logger.error(LogMessage.error.onResumeConversationFail())
      throw new InternalServerErrorException(LogMessage.error.onResumeConversationFail());
    }

  }

  @Post([`break`, `stop`, `reset`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.break.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.break.aboutOkResponse() })
  public async breakConversation(): Promise<void> {

    const startTime: number = Date.now();
    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onBreakMissingConversation());
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
    this.settings.app.conversationId = null;

    this.logger.log(LogMessage.log.onBreakConversation(this.settings.app.conversationName));
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
      this.logger.warn(LogMessage.warn.onInvalidPayload());
      throw new BadRequestException(LogMessage.warn.onInvalidPayload());
    }

    if (body.mode !== `REPLACE` && body.mode !== `MERGE`) {
      this.logger.warn(LogMessage.warn.onInvalidMode(body.mode));
      throw new BadRequestException(LogMessage.warn.onInvalidMode(body.mode));
    }

    body.botId === 1
      ? this.settings.app.state.usersMessagesStackForBot1.push(body)
      : this.settings.app.state.usersMessagesStackForBot2.push(body);
    this.logger.log(LogMessage.log.onInjectMessage());
  }

  @Get([`summary`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.summaryGeneration.aboutInternalServerError() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.summaryGeneration.aboutInternalServerError() })
  public async prepareCurrentTalkSummary(): Promise<void> {

    const startTime: number = Date.now();
    let maximumConnectingAttemptsNumber: number = this.settings.app.maxAttempts;
    let maximumGeneratingAttemptsNumber: number = this.settings.app.maxAttempts;
    let isSummaryFinished: boolean = false;
    let summary: string = ``;

    if (this.settings.app.state.shouldContinue) {
      this.settings.app.state.shouldContinue = false;
    }

    while (this.settings.app.state.isGeneratingOnAir && maximumConnectingAttemptsNumber-- >= 0) {
      const timeInMiliseconds = 30000;
      await this.wait(timeInMiliseconds);
    }

    if (maximumConnectingAttemptsNumber === 0) {
      this.logger.error(LogMessage.error.onSummaryGenerationFail())
      throw new InternalServerErrorException(LogMessage.error.onSummaryGenerationFail());
    }

    this.settings.app.state.isGeneratingOnAir = true;
    while (!isSummaryFinished && maximumGeneratingAttemptsNumber-- > 0) {

      summary = await this.ai.summarize();

      if (summary === `` || summary === null) {
        continue;
      }

      isSummaryFinished = true;

    }

    if (!isSummaryFinished) {
      throw new InternalServerErrorException(LogMessage.error.onSummarizeFail());
    }

    this.settings.app.state.isGeneratingOnAir = false;

    this.settings.app.state.shouldContinue = true;
    const payload: MessageEventPayload = {
      message: this.settings.app.state.enqueuedMessage
    };

    try {
      await this.eventEmitter.emitAsync(event.message, payload);
      this.settings.noticeInterrupt(`resume`);
      this.logger.log(LogMessage.log.onResumeConversation());

    } catch (error) {
      this.logger.error(LogMessage.error.onResumeConversationFail())
      throw new InternalServerErrorException(LogMessage.error.onResumeConversationFail());
    }
  }

  @Post([`restore`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: `` })
  @ApiInternalServerErrorResponse({ description: `` })
  @ApiForbiddenResponse({ description: `` })
  public async restoreConversationFromPayload(
    @Body() body: RestoreConversationPayloadDto
  ): Promise<void> {

    const startTime: number = Date.now();

    if (this.settings.app.isConversationInProgres) {
      throw new ForbiddenException(`Couldn't load conversation. There is already running one.`)
    }

    const relations: string[] = [`settings`, `states`, `messages`, `comments`];
    let conversation: Conversation;

    if (!Number.isNaN(+body.id)) {
      conversation = await this.conversation.findOne({ where: { id: +body.id }, relations });
    } else {
      conversation = await this.conversation.findOne({ where: { conversationName: body.id }, relations });
    }

    if (!conversation) {
      this.logger.warn(`Specified conversation not found`);
      throw new NotFoundException(`Specified conversation not found`);
    }


  }

  @Post([`restore/:id`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: `` })
  @ApiInternalServerErrorResponse({ description: `` })
  @ApiForbiddenResponse({ description: `` })
  @ApiNotFoundResponse({ description: `` })
  public async restoreConversationFromDatabase(
    @Param() { id }: RestoreConversationByIdDto
  ): Promise<void> {

    const startTime: number = Date.now();
    let conversation: Conversation;

    if (this.settings.app.isConversationInProgres) {
      throw new ForbiddenException(`Couldn't load conversation. There is already running one.`)
    }

    if (!Number.isNaN(+id)) {
      conversation = await this.conversation.findOne({ where: { id: +id } });
    } else {
      conversation = await this.conversation.findOne({ where: { conversationName: id } });
    }

    if (!conversation) {
      this.logger.warn(`Specified conversation not found`);
      throw new NotFoundException(`Specified conversation not found`);
    }



  }

}
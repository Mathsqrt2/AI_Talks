import { SwaggerMessages, LogMessage, prompts } from '@libs/constants';
import { MessageEventPayload, InitEventPayload } from '@libs/types';
import {
  RestoreConversationPayloadDto, RestoreConversationByIdDto,
  InitDto, ConversationInitDto, InjectMessageDto
} from '@libs/dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsService } from '@libs/settings';
import { Conversation } from '@libs/database';
import { Logger } from '@libs/logger';
import { AiService } from '@libs/ai';
import { Repository } from 'typeorm';
import {
  ApiAcceptedResponse, ApiBadRequestResponse, ApiBody,
  ApiForbiddenResponse, ApiInternalServerErrorResponse,
  ApiNotFoundResponse, ApiOkResponse, ApiParam
} from '@nestjs/swagger';
import {
  BadRequestException, Body, Controller, Param, Post,
  ForbiddenException, Get, HttpCode, HttpStatus,
  InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { EventsEnum } from '@libs/enums';
import { ConversationService } from 'src/conversation.service';

@Controller(`api/v1/conversation`)
export class ConversationController {

  constructor(
    @InjectRepository(Conversation) private readonly conversation: Repository<Conversation>,
    private readonly conversationService: ConversationService,
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
    private readonly logger: Logger,
    private readonly ai: AiService,
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
    if (this.settings.app.isConversationInProgres) {
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
    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onPauseMissingConversation(), { startTime });
      throw new BadRequestException(LogMessage.warn.onPauseMissingConversation())
    }

    this.settings.app.state.shouldContinue = false;
    this.settings.noticeInterrupt(`pause`);
    this.logger.log(LogMessage.log.onPauseConversation(), { startTime });

  }

  @Post([`resume`, `continue`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.resume.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.resume.aboutOkResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.resume.aboutInternalServerError() })
  public async resumeConversation(): Promise<void> {

    const startTime: number = Date.now();
    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onResumeMissingConversation(), { startTime });
      throw new BadRequestException(LogMessage.warn.onResumeMissingConversation())
    }

    this.settings.app.state.shouldContinue = true;
    const payload: MessageEventPayload = {
      message: this.settings.app.state.enqueuedMessage
    };

    try {
      await this.eventEmitter.emitAsync(EventsEnum.message, payload);
      this.settings.noticeInterrupt(`resume`);
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
    if (!this.settings.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onBreakMissingConversation(), { startTime });
      throw new BadRequestException(LogMessage.warn.onBreakMissingConversation())
    }

    try {
      await this.conversationService.stopConversation();
    } catch (error) {
      this.logger.error(LogMessage.error.onBreakConversationFail(), { startTime });
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

    if (body.mode !== `REPLACE` && body.mode !== `MERGE`) {
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

    if(this.settings.app.state.currentMessageIndex === 0 || this.settings.app.state.lastBotMessages?.length === 0){
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
      this.settings.noticeInterrupt(`resume`);
      this.logger.log(LogMessage.log.onResumeConversation(), { startTime });
      return summary;

    } catch (error) {
      this.logger.error(LogMessage.error.onResumeConversationFail(), { startTime, error });
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
      this.logger.warn(`Specified conversation not found`, { startTime });
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
      this.logger.warn(`Specified conversation not found`, { startTime });
      throw new NotFoundException(`Specified conversation not found`);
    }


  }

}
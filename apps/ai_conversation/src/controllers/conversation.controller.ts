import {
  ApiAcceptedResponse, ApiBadRequestResponse, ApiBody,
  ApiForbiddenResponse, ApiInternalServerErrorResponse,
  ApiOkResponse, ApiParam
} from '@nestjs/swagger';
import {
  BadRequestException, Body, Controller,
  ForbiddenException, HttpCode, HttpStatus,
  InternalServerErrorException,
  Param, Post
} from '@nestjs/common';
import { SwaggerMessages } from '../constants/swagger.descriptions';
import { ConversationInitDto } from '../dtos/conversation-init.dto';
import { LogMessage } from '../constants/conversation.responses';
import { InjectMessageDto } from '../dtos/inject-message.dto';
import { event } from '../constants/conversation.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InitEventPayload } from '@libs/types/events';
import { ConfigService } from '@libs/settings';
import { Logger } from '@libs/logger';
import { MessageEventPayload } from '@libs/types/conversarion';

@Controller()
export class ConversationController {

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly config: ConfigService,
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
    @Param(`id`) id: number,
  ): Promise<void> {

    if (this.config.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onConversationAlreadyRunning());
      throw new ForbiddenException(LogMessage.warn.onConversationAlreadyRunning());
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.warn(LogMessage.warn.onIdOutOfRange(id));
      throw new BadRequestException(LogMessage.warn.onIdOutOfRange(id))
    }

    try {
      const initEventPayload: InitEventPayload = {
        speaker_id: +id,
        prompt: body?.prompt || process.env.INITIAL_PROMPT,
      };
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

    if (!this.config.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onPauseMissingConversation());
      throw new BadRequestException(LogMessage.warn.onPauseMissingConversation())
    }

    this.config.app.state.shouldContinue = false;
    this.config.noticeInterrupt(`pause`);
    this.logger.log(LogMessage.log.onPauseConversation());
  }

  @Post([`resume`, `continue`])
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.resume.aboutBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.resume.aboutOkResponse() })
  @ApiInternalServerErrorResponse({ description: SwaggerMessages.resume.aboutInternalServerError() })
  public async resumeConversation(): Promise<void> {

    if (!this.config.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onResumeMissingConversation());
      throw new BadRequestException(LogMessage.warn.onResumeMissingConversation())
    }

    this.config.app.state.shouldContinue = true;
    const payload: MessageEventPayload = {
      message: this.config.app.state.enqueuedMessage
    };

    try {
      await this.eventEmitter.emitAsync(event.message, payload);
      this.config.noticeInterrupt(`resume`);
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

    if (!this.config.app.isConversationInProgres) {
      this.logger.warn(LogMessage.warn.onBreakMissingConversation());
      throw new BadRequestException(LogMessage.warn.onBreakMissingConversation())
    }

    await this.config.clearStats();

    this.config.app.state.shouldContinue = false;
    this.config.app.state.enqueuedMessage = null;
    this.config.app.state.usersMessagesStackForBot1 = [];
    this.config.app.state.usersMessagesStackForBot2 = [];
    this.config.app.state.lastBotMessages = [];
    this.config.app.state.currentMessageIndex = 0;
    this.config.app.isConversationInProgres = false;
    this.config.app.conversationName = null;

    this.logger.log(LogMessage.log.onBreakConversation(this.config.app.conversationName));
  }

  @Post([`inject`])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBadRequestResponse({ description: SwaggerMessages.inject.aboutBadRequestResponse() })
  @ApiAcceptedResponse({ description: SwaggerMessages.inject.aboutAcceptedResponse() })
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

    body.botId === 1
      ? this.config.app.state.usersMessagesStackForBot1.push(body)
      : this.config.app.state.usersMessagesStackForBot2.push(body);
    this.logger.log(LogMessage.log.onInjectMessage());
  }

}
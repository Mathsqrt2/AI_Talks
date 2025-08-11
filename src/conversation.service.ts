import { Message, InjectContentPayload, InitEventPayload, MessageEventPayload } from '@libs/types';
import { Conversation, Message as MessageEntity } from '@libs/database';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { prompts, LogMessage } from '@libs/constants';
import { BotsEnum, EventsEnum } from '@libs/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramGateway } from '@libs/telegram';
import { SettingsService } from '@libs/settings';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { State } from '@libs/database';
import { Logger } from '@libs/logger';
import { AiService } from '@libs/ai';
import { Repository } from 'typeorm';
import { SHA256 } from 'crypto-js';

@Injectable()
export class ConversationService {

  constructor(
    @InjectRepository(Conversation) private readonly conversation: Repository<Conversation>,
    @InjectRepository(MessageEntity) private readonly message: Repository<MessageEntity>,
    @InjectRepository(State) private readonly state: Repository<State>,
    private readonly eventEmitter: EventEmitter2,
    private readonly telegram: TelegramGateway,
    private readonly settings: SettingsService,
    private readonly logger: Logger,
    private readonly ai: AiService,
  ) { }

  private generateConversationName = async (): Promise<boolean> => {

    const startTime: number = Date.now();
    const seed = `${JSON.stringify(this.settings.app)}${Date.now()}`;
    const currentStateHash: string = SHA256(seed).toString();

    try {

      this.settings.app.conversationName = currentStateHash;
      this.settings.app.conversationId = (await this.conversation.save({
        conversationName: currentStateHash,
        initialPrompt: prompts.initialPrompt,
      })).id

      return true;
    } catch (error) {
      this.logger.error(LogMessage.error.onSaveConversationNameFail(currentStateHash), { error, startTime });
      return false;
    }
  }

  private wait = async (timeInMiliseconds: number = 10000): Promise<void> => (
    new Promise(resolve => setTimeout(() => resolve(), timeInMiliseconds))
  );

  @OnEvent(EventsEnum.startConversation, { async: true })
  private async startConversation(initPayload: InitEventPayload): Promise<void> {

    const startTime: number = Date.now();
    const isNameGeneratedSuccessfully: boolean = await this.generateConversationName();
    if (!isNameGeneratedSuccessfully) {
      this.logger.warn(LogMessage.warn.onInitializationFail(), { startTime });
      return;
    }

    const currentBot: BotsEnum = initPayload.speaker_id === 1
      ? BotsEnum.BOT_1
      : BotsEnum.BOT_2;

    this.settings.app.isConversationInProgres = true;
    this.settings.app.state.shouldContinue = true;
    this.settings.app.state.lastResponder = currentBot;

    const payload: MessageEventPayload = {
      message: {
        generatingStartTime: new Date(),
        author: currentBot,
        content: initPayload.prompt,
        generationTime: 0,
        generatingEndTime: new Date()
      }
    };

    this.settings.app.state.lastBotMessages.push({
      author: BotsEnum.SYSTEM,
      content: process.env.OLLAMA_PROMPT,
      generatingStartTime: new Date(),
      generatingEndTime: new Date(),
      generationTime: 0,
    });

    await this.telegram.respondBy(currentBot, prompts.separator);
    await this.telegram.respondBy(currentBot, payload.message?.content);
    await this.eventEmitter.emitAsync(EventsEnum.message, payload);
  }

  @OnEvent(EventsEnum.message, { async: true })
  private async sendMessage(payload: MessageEventPayload): Promise<void> {

    const startTime: number = Date.now();
    const generatingStartTime: Date = new Date();
    const currentBot: BotsEnum = payload.message.author === BotsEnum.BOT_1
      ? BotsEnum.BOT_2
      : BotsEnum.BOT_1;
    let message: Message = payload.message;
    let isMessageDelivered: boolean = false;
    let isMessageGenerated: boolean = false;
    let deliveryAttempts: number = this.settings.app.maxAttempts;
    let generateAttempts: number = this.settings.app.maxAttempts;
    let content: string;

    if (currentBot === BotsEnum.BOT_1 && this.settings.app.state.usersMessagesStackForBot1?.length > 0) {
      const messageFromOutside: InjectContentPayload = this.settings.app.state.usersMessagesStackForBot1.shift();
      message.content = await this.ai.merge(messageFromOutside, message);
    } else if (currentBot === BotsEnum.BOT_2 && this.settings.app.state.usersMessagesStackForBot2?.length > 0) {
      const messageFromOutside: InjectContentPayload = this.settings.app.state.usersMessagesStackForBot2.shift();
      message.content = await this.ai.merge(messageFromOutside, message);
    }

    const lastMessages = structuredClone(this.settings.app.state.lastBotMessages);
    const maxHistorySize: number = this.settings.app.maxMessagesCount;
    lastMessages.push(message);

    if (lastMessages.length > maxHistorySize) {
      const initialPrompt = lastMessages.shift();
      this.settings.app.state.lastBotMessages = lastMessages.slice(-maxHistorySize);
      this.settings.app.state.lastBotMessages.unshift(initialPrompt);
    } else {
      this.settings.app.state.lastBotMessages = lastMessages;
    }

    while (!isMessageGenerated && generateAttempts-- > 0) {
      try {

        content = await this.ai.chatAs(currentBot);

        if (content === ``) {
          continue;
        }

        isMessageGenerated = true;

      } catch (error) {
        this.logger.error(LogMessage.error.onGenerateMessageFail(), { error, startTime });
        await this.wait(this.settings.app.retryAfterTimeInMiliseconds);
      }
    }

    if (!isMessageGenerated && generateAttempts <= 0) {
      await this.settings.archiveCurrentState();
      this.settings.app.state.shouldContinue = false;
      this.settings.app.state.isGeneratingOnAir = false;
      this.logger.error(LogMessage.error.onGenerateRetryFail(), { startTime });
      return;
    }

    const newPayload: MessageEventPayload = {
      message: {
        author: currentBot,
        content,
        generatingStartTime,
        generatingEndTime: new Date(),
        generationTime: Date.now() - generatingStartTime.getTime(),
      }
    }

    if (!this.settings.app.isConversationInProgres) {
      this.logger.error(LogMessage.error.onMessageAfterConversationBreak(), { startTime });
      return;
    }

    if (!this.settings.app.state.shouldContinue) {
      this.settings.app.state.enqueuedMessage = payload.message;
      this.logger.warn(LogMessage.warn.onConversationInterrupt(), { startTime });
      return;
    }

    while (!isMessageDelivered && deliveryAttempts-- > 0) {

      try {

        await this.telegram.respondBy(currentBot, newPayload.message?.content);
        await this.eventEmitter.emitAsync(EventsEnum.message, newPayload);
        await this.message.save({
          conversationId: this.settings.app.conversationId,
          content: newPayload.message?.content,
          generationTime: newPayload.message.generationTime,
          generatingStartTime: newPayload.message.generatingStartTime,
          generatingEndTime: newPayload.message.generatingEndTime,
          author: newPayload.message.author,
        })
        this.settings.app.state.lastBotMessages.push(newPayload.message);
        this.settings.app.state.lastResponder = currentBot;
        this.logger.log(LogMessage.log.onMessageEmission(this.settings.app.state.currentMessageIndex++), { startTime });
        isMessageDelivered = true;

      } catch (error) {
        this.logger.error(LogMessage.error.onDeliveryFail(), { error, startTime });
        await this.wait(this.settings.app.retryAfterTimeInMiliseconds);
      }

    }

    let currentStateArchive = await this.state.findOneBy({ conversationId: this.settings.app.conversationId }) || {};
    const { lastResponder, enqueuedMessage, ...state } = this.settings.app.state;

    currentStateArchive = {
      ...currentStateArchive,
      ...state,
      conversationId: this.settings.app.conversationId,
      lastResponderName: lastResponder || null,
      enqueuedMessageContent: enqueuedMessage?.content || null,
      enqueuedMessageAuthor: enqueuedMessage?.author || null,
    };

    await this.state.save(currentStateArchive).catch(error => {
      this.logger.error(error, { error, startTime });
    });

    if (!isMessageDelivered && deliveryAttempts <= 0) {

      await this.settings.archiveCurrentState();
      this.settings.app.state.shouldContinue = false;
      this.logger.error(LogMessage.error.onRetryFail(), { startTime });
      return;
    }
  }

  public async stopConversation() {

    const startTime: number = Date.now();
    await this.settings.clearStatistics();

    this.settings.app.state.shouldContinue = false;
    this.settings.app.state.enqueuedMessage = null;
    this.settings.app.state.usersMessagesStackForBot1 = [];
    this.settings.app.state.usersMessagesStackForBot2 = [];
    this.settings.app.state.lastBotMessages = [];
    this.settings.app.state.currentMessageIndex = 0;
    this.settings.app.isConversationInProgres = false;
    this.settings.app.conversationName = null;
    this.settings.app.conversationId = null;

    this.logger.log(LogMessage.log.onBreakConversation(this.settings.app.conversationName), { startTime });

  }

  public async createConversationSummary(): Promise<string> {

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
      this.logger.error(LogMessage.error.onSummaryGenerationFail(), { startTime })
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

    return summary;
  }

}

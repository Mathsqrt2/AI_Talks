import { InjectContentPayload, MessageEventPayload } from '@libs/types/conversarion';
import { LogMessage } from './constants/conversation.responses';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { event } from './constants/conversation.constants';
import { InitEventPayload } from '@libs/types/events';
import { TelegramGateway } from '@libs/telegram';
import { SettingsService } from '@libs/settings';
import { Message } from '@libs/types/settings';
import { Inject, Injectable } from '@nestjs/common';
import { Bot } from '@libs/types/telegram';
import { Logger } from '@libs/logger';
import { Conversation } from '@libs/database/entities/conversation/conversation.entity';
import { AiService } from '@libs/ai';
import { SHA256 } from 'crypto-js';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {

  constructor(
    @Inject(`CONVERSATION`) private readonly conversation: Repository<Conversation>,
    private readonly eventEmitter: EventEmitter2,
    private readonly telegram: TelegramGateway,
    private readonly settings: SettingsService,
    private readonly logger: Logger,
    private readonly ai: AiService,
  ) { }

  private generateConversationName = async (): Promise<boolean> => {
    const seed = `${JSON.stringify(this.settings.app)}${Date.now()}`;
    const currentStateHash: string = SHA256(seed).toString();

    try {

      this.settings.app.conversationName = currentStateHash;
      this.settings.app.conversationId = (await this.conversation.save({
        conversationName: currentStateHash,
        initialPrompt: process.env.INITIAL_PROMPT,
        createdAt: Date.now(),
      })).id

      return true;
    } catch (error) {
      this.logger.error(`Failed to save conversation in database.`, { error });
      return false;
    }
  }

  private wait = async (timeInMiliseconds: number = 10000): Promise<void> => (
    new Promise(resolve => setTimeout(() => resolve(), timeInMiliseconds))
  );

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(initPayload: InitEventPayload): Promise<void> {

    const isNameGeneratedSuccessfully: boolean = await this.generateConversationName();
    if (!isNameGeneratedSuccessfully) {
      this.logger.warn(`Failed to initialize new conversation.`);
      return;
    }

    const currentBot: Bot = initPayload.speaker_id === 1
      ? { name: 'bot_1' }
      : { name: `bot_2` };

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
      author: { name: `system` },
      content: process.env.OLLAMA_PROMPT,
      generatingStartTime: new Date(),
      generatingEndTime: new Date(),
      generationTime: 0,
    });

    await this.telegram.respondBy(currentBot, process.env.SEPARATOR);
    await this.telegram.respondBy(currentBot, payload.message.content);
    await this.eventEmitter.emitAsync(event.message, payload);
  }

  @OnEvent(event.message, { async: true })
  private async sendMessage(payload: MessageEventPayload): Promise<void> {

    const generatingStartTime: Date = new Date();
    const currentBot: Bot = { name: payload.message.author.name === `bot_1` ? `bot_2` : `bot_1` };
    let message: Message = payload.message;
    let isMessageDelivered: boolean = false;
    let isMessageGenerated: boolean = false;
    let deliveryAttempts: number = this.settings.app.maxAttempts;
    let generateAttempts: number = this.settings.app.maxAttempts;
    let content: string;

    if (currentBot.name === `bot_1` && this.settings.app.state.usersMessagesStackForBot1?.length > 0) {
      const messageFromOutside: InjectContentPayload = this.settings.app.state.usersMessagesStackForBot1.shift();
      message.content = await this.ai.merge(messageFromOutside, message);
    } else if (currentBot.name === `bot_2` && this.settings.app.state.usersMessagesStackForBot2?.length > 0) {
      const messageFromOutside: InjectContentPayload = this.settings.app.state.usersMessagesStackForBot1.shift();
      message.content = await this.ai.merge(messageFromOutside, message);
    }

    const lastMessages = [...this.settings.app.state.lastBotMessages];
    const maxHistorySize: number = this.settings.app.maxMessagesCount;
    lastMessages.push(message);

    if (lastMessages.length > maxHistorySize) {
      const initialPrompt = lastMessages.shift();
      this.settings.app.state.lastBotMessages = lastMessages.slice(-maxHistorySize);
      this.settings.app.state.lastBotMessages.unshift(initialPrompt);
    }

    while (!isMessageGenerated && generateAttempts-- > 0) {
      try {

        content = await this.ai.chatAs(currentBot);
        isMessageGenerated = true;

      } catch (error) {
        this.logger.error(LogMessage.error.onGenerateMessageFail())
        await this.wait(this.settings.app.retryAfterTimeInMiliseconds);
      }
    }

    if (!isMessageGenerated && generateAttempts <= 0) {
      await this.settings.archiveCurrentState();
      this.settings.app.state.shouldContinue = false;
      this.logger.error(LogMessage.error.onGenerateRetryFail());
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
      this.logger.error(LogMessage.error.onMessageAfterConversationBreak());
      return;
    }

    if (!this.settings.app.state.shouldContinue) {
      this.settings.app.state.enqueuedMessage = payload.message;
      this.logger.warn(LogMessage.warn.onConversationInterrupt());
      return;
    }


    while (!isMessageDelivered && deliveryAttempts-- > 0) {

      try {

        await this.telegram.respondBy(currentBot, newPayload.message.content);
        await this.eventEmitter.emitAsync(event.message, newPayload);
        this.settings.app.state.lastBotMessages.push(newPayload.message);
        this.settings.app.state.lastResponder = currentBot;
        this.logger.log(LogMessage.log.onMessageEmission(this.settings.app.state.currentMessageIndex++));
        isMessageDelivered = true;

      } catch (error) {
        this.logger.error(LogMessage.error.onDeliveryFail(), { error });
        await this.wait(this.settings.app.retryAfterTimeInMiliseconds);
      }

    }

    if (!isMessageDelivered && deliveryAttempts <= 0) {

      await this.settings.archiveCurrentState();
      this.settings.app.state.shouldContinue = false;
      this.logger.error(LogMessage.error.onRetryFail());
      return;
    }
  }

}

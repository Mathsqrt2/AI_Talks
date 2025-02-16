import { InjectContentPayload, MessageEventPayload } from '@libs/types/conversarion';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InitEventPayload } from '@libs/types/events';
import { TelegramGateway } from '@libs/telegram';
import { ConfigService } from '@libs/settings';
import { Message } from '@libs/types/settings';
import { Injectable } from '@nestjs/common';
import { Bot } from '@libs/types/telegram';
import { Logger } from '@libs/logger';
import { AiService } from '@libs/ai';
import { LogMessage } from './constants/conversation.responses';
import { event } from './constants/conversation.constants';
import { SHA256 } from 'crypto-js';

@Injectable()
export class ConversationService {

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly telegram: TelegramGateway,
    private readonly config: ConfigService,
    private readonly logger: Logger,
    private readonly ai: AiService,
  ) { }

  private generateConversationName = (): void => {
    const seed = `${JSON.stringify(this.config.app)}${Date.now()}`;
    this.config.app.conversationName = SHA256(seed).toString();
  }

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(initPayload: InitEventPayload): Promise<void> {

    this.generateConversationName();
    const currentBot: Bot = initPayload.speaker_id === 1
      ? { name: 'bot_1' }
      : { name: `bot_2` };

    this.config.app.isConversationInProgres = true;
    this.config.app.state.shouldContinue = true;
    this.config.app.state.lastResponder = currentBot;

    const payload: MessageEventPayload = {
      message: {
        generatingStartTime: new Date(),
        author: currentBot,
        content: initPayload.prompt,
        generationTime: 0,
        generatingEndTime: new Date()
      }
    };

    await this.telegram.respondBy(currentBot, payload.message.content);
    await this.eventEmitter.emitAsync(event.message, payload);
    this.logger.log(LogMessage.log.onMessageEventEmitted(
      currentBot.name,
      this.config.app.state.currentMessageIndex
    ));
  }

  @OnEvent(event.message, { async: true })
  private async sendMessage(payload: MessageEventPayload): Promise<void> {

    const generatingStartTime: Date = new Date();
    this.config.app.state.lastBotMessages.push(payload.message);
    let message: Message = payload.message;

    const currentBot: Bot = {
      name: payload.message.author.name === `bot_1` ? `bot_2` : `bot_1`
    };

    if (currentBot.name === `bot_1` && this.config.app.state.usersMessagesStackForBot1?.length > 0) {
      const messageFromOutside: InjectContentPayload = this.config.app.state.usersMessagesStackForBot1.shift();
      message.content = await this.ai.merge(messageFromOutside, message);
    } else if (currentBot.name === `bot_2` && this.config.app.state.usersMessagesStackForBot2?.length > 0) {
      const messageFromOutside: InjectContentPayload = this.config.app.state.usersMessagesStackForBot1.shift();
      message.content = await this.ai.merge(messageFromOutside, message);
    }

    const response = await this.ai.respondTo(message.content);
    const newPayload: MessageEventPayload = {
      message: {
        author: currentBot,
        content: response,
        generatingStartTime,
        generatingEndTime: new Date(),
        generationTime: Date.now() - generatingStartTime.getTime(),
      }
    }

    const currentMessageIndex = this.config.app.state.currentMessageIndex++;
    this.config.app.state.lastResponder = currentBot;

    if (!this.config.app.isConversationInProgres) {
      this.logger.error(LogMessage.error.onMessageAfterConversationBreak());
      return;
    }

    if (!this.config.app.state.shouldContinue) {
      this.config.app.state.enqueuedMessage = payload.message;
      this.logger.warn(LogMessage.warn.onConversationInterrupt());
      return;
    }

    await this.telegram.respondBy(currentBot, response);
    await this.eventEmitter.emitAsync(event.message, newPayload);
    this.logger.log(LogMessage.log.onMessageEmission(currentMessageIndex));
  }

}

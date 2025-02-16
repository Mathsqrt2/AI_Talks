import { Injectable } from '@nestjs/common';
import { event } from './constants/conversation.constants';
import { InitEventPayload } from '@libs/types/events';
import { ConfigService } from '@libs/settings';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@libs/logger';
import { SHA256 } from 'crypto-js';
import { LogMessage } from './constants/conversation.responses';
import { Bot } from '@libs/types/telegram';

@Injectable()
export class ConversationService {

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) { }

  private generateConversationName = (): void => {
    const seed = `${JSON.stringify(this.config.app)}${Date.now()}`;
    this.config.app.conversationName = SHA256(seed).toString();
  }

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(payload: InitEventPayload): Promise<void> {

    this.generateConversationName();
    const currentBot: Bot = payload.speaker_id === 1
      ? { name: 'bot_1' }
      : { name: `bot_2` };

    this.config.app.isConversationInProgres = true;
    this.config.app.state.shouldContinue = true;
    this.config.app.state.lastResponder = currentBot;

    await this.eventEmitter.emitAsync(event.message);
    this.logger.log(LogMessage.log.onMessageEventEmitted(
      currentBot.name,
      this.config.app.state.currentMessageIndex++
    ));

  }

  @OnEvent(event.resumeConversation, { async: true })
  private async resumeConversation(): Promise<void> {

    this.config.app.state.shouldContinue = true;
    await this.eventEmitter.emitAsync(event.message, this.config.app.state);

  }

  @OnEvent(event.message, { async: true })
  private async sendMessage(): Promise<void> {

    if (this.config.app.state.shouldContinue) {

    }

  }

  private async generateResponse(): Promise<string> {
    return ``;
  }

  private toggleContext(): void {

  }


}

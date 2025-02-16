import { Injectable } from '@nestjs/common';
import { event } from './constants/conversation.constants';
import { EventPayload } from '@libs/types/events';
import { SettingsService } from '@libs/settings';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Bot } from '@libs/types/telegram';
import { Logger } from '@libs/logger';
import { SHA256 } from 'crypto-js';

@Injectable()
export class ConversationService {

  private lastResponder: Bot = null;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
    private readonly logger: Logger,
  ) { }

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(payload: EventPayload): Promise<void> {

    this.settings.app.conversationName = SHA256(`${JSON.stringify(this.settings.app)}${Date.now()}`).toString()
    this.lastResponder = payload.speaker_id === 1
      ? { name: 'bot_1' }
      : { name: `bot_2` };

  }

  @OnEvent(event.resumeConversation, { async: true })
  private async resumeConversation(): Promise<void> {

    this.settings.app.state.shouldContinue = true;
    await this.eventEmitter.emitAsync(event.message, this.settings.app.state);

  }

  @OnEvent(event.message, { async: true })
  private async sendMessage(): Promise<void> {

    if (this.settings.app.state.shouldContinue) {

    }

  }

  private async generateResponse(): Promise<string> {
    return ``;
  }

  private toggleContext(): void {

  }


}

import { Injectable } from '@nestjs/common';
import { event } from './constants/conversation.constants';
import { EventPayload } from '@libs/types/events';
import { ConfigService } from '@libs/settings';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@libs/logger';
import { SHA256 } from 'crypto-js';

@Injectable()
export class ConversationService {

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) { }

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(payload: EventPayload): Promise<void> {

    this.config.app.conversationName = SHA256(`${JSON.stringify(this.config.app)}${Date.now()}`).toString()
    this.config.app.state.lastResponder = payload.speaker_id === 1
      ? { name: 'bot_1' }
      : { name: `bot_2` };

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

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { event } from './constants/conversation.constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SettingsFile } from '@libs/types/settings';
import { EventPayload } from '@libs/types/events';
import { SettingsService } from '@libs/settings';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Bot } from '@libs/types/telegram';
import { Logger } from '@libs/logger';
import { Ollama } from 'ollama';
import { SHA256 } from 'crypto-js';

@Injectable()
export class ConversationService implements OnApplicationBootstrap {

  private readonly model: Ollama = new Ollama({});
  private lastResponder: Bot = null;
  private config: SettingsFile = null;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly settings: SettingsService,
    private readonly logger: Logger,
  ) { }

  public onApplicationBootstrap() {
    this.settings.app.subscribe((settingsFile: SettingsFile) => {
      this.config = settingsFile;
    });
  }

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(payload: EventPayload): Promise<void> {

    this.config.conversationName = SHA256(`${JSON.stringify(this.config)}${Date.now()}`).toString()
    this.lastResponder = payload.speaker_id === 1
      ? { name: 'bot_1' }
      : { name: `bot_2` };

  }

  @OnEvent(event.resumeConversation, { async: true })
  private async resumeConversation(): Promise<void> {

    this.config.state.shouldContinue = true;
    await this.eventEmitter.emitAsync(event.message, this.config.state);

  }

  @OnEvent(event.message, { async: true })
  private async sendMessage(): Promise<void> {

    if (this.config.state.shouldContinue) {

    }

  }

  private async generateResponse(): Promise<string> {
    return ``;
  }

  private toggleContext(): void {

  }


}

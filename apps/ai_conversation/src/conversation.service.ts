import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { event } from './constants/conversation.constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SettingsFile } from '@libs/types/settings';
import { EventPayload } from '@libs/types/events';
import { SettingsService } from '@libs/settings';
import { OnEvent } from '@nestjs/event-emitter';
import { Bot } from '@libs/types/telegram';
import { Logger } from '@libs/logger';
import { Ollama } from 'ollama';

@Injectable()
export class ConversationService implements OnApplicationBootstrap {

  private readonly model: Ollama = new Ollama({});
  private lastResponder: Bot = null;
  private config: SettingsFile = null;

  constructor(
    private readonly settings: SettingsService,
    private readonly logger: Logger,
  ) { }

  public onApplicationBootstrap() {
    this.settings.app.subscribe((settingsFile: SettingsFile) => {
      this.config = settingsFile;
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private refreshSettings() {
    console.log(`test`);
    this.logger.debug("test")
  }

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(payload: EventPayload): Promise<void> {

    this.lastResponder = payload.speaker_id === 1
      ? { name: 'bot_1' }
      : { name: `bot_2` };

  }

  @OnEvent(event.breakConversation, { async: true })
  private async breakConversation(): Promise<void> {

  }

  @OnEvent(event.resumeConversation, { async: true })
  private async resumeConversation(): Promise<void> {

  }

  @OnEvent(event.message, { async: true })
  private async sendMessage(): Promise<void> {



  }

  public async initializeConversation(): Promise<void> {

  }

  private async generateResponse(): Promise<string> {
    return ``;
  }

  private toggleContext(): void {

  }


}

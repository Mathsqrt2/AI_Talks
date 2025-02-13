import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectLogger, Logger } from '@libs/logger';
import { SettingsService } from '@libs/settings';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Bot } from '@libs/types/telegram';
import { event } from './constants/conversation.constants';
import { Ollama } from 'ollama';
import { SettingsFile } from '@libs/types/settings';
import { EventPayload } from '@libs/types/events';

@Injectable()
export class ConversationService implements OnApplicationBootstrap {

  private readonly model: Ollama = new Ollama({});
  private lastResponder: Bot = null;
  private config: SettingsFile = null;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly settings: SettingsService,
  ) { }

  public onApplicationBootstrap() {
    this.settings.app.subscribe((settingsFile: SettingsFile) => {
      this.config = settingsFile;
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private refreshSettings() {

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

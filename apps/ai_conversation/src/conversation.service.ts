import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectLogger, Logger } from '@libs/logger';
import { SettingsService } from '@libs/settings';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Bot } from '@libs/types/telegram';

import { logMessages } from './conversation.responses';
import { event } from './conversation.constants';
import { Ollama } from 'ollama';
import { SettingsFile } from '@libs/types/settings';

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
    this.settings.settings.subscribe((settingsFile: SettingsFile) => {
      this.config = settingsFile;
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private refreshSettings() {
    this.logger.debug('test')
  }

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(): Promise<void> {

    if (this.config.isConversationInProgres) {
      this.logger.warn(logMessages.warn.conversationAlreadyRunning());
    }


  }

  @OnEvent(event.breakConversation, { async: true })
  private async breakConversation(): Promise<void> {

  }

  @OnEvent(event.resumeConversation, { async: true })
  private async resumeConversation(): Promise<void> {

  }

  public async initializeConversation(): Promise<void> {

  }

  private async generateResponse(): Promise<string> {
    return ``;
  }

  private toggleContext(): void {

  }


}

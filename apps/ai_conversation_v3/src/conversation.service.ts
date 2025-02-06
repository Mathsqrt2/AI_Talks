import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectLogger, Logger } from '@libs/logger';
import { SettingsService } from '@libs/settings';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Bots } from '@libs/types/telegram';

import { logMessages } from './conversation.responses';
import { event } from './conversation.constants';
import { Ollama } from 'ollama';

@Injectable()
export class ConversationService {

  private readonly model: Ollama = new Ollama({});
  private lastResponder: Bots = null;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly settings: SettingsService,
  ) { }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private refreshSettings() {
    this.logger.debug('test')
  }

  @OnEvent(event.startConversation, { async: true })
  private async startConversation(): Promise<void> {

    if (this.settings.isConversationInProgres) {
      this.logger.warn(logMessages.warn.conversationAlreadyRunning());
    }

    this.settings

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

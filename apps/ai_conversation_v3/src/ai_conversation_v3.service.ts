import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SettingsService } from './settings/settings.service';
import { Speaker } from '@libs/types/telegram';
import { Ollama } from 'ollama';
import { logMessages } from './ai_conversation_v3.responses';
import { event } from './ai_conversation_v3.constants';

@Injectable()
export class ConversationService {

  private readonly logger: Logger = new Logger(`Speaker`);
  private readonly model: Ollama = new Ollama({});
  private lastResponder: Speaker = null;

  constructor(
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

  @OnEvent(event.pauseConversation, { async: true })
  private async pauseConversation(): Promise<void> {

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

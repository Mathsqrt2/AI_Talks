import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SettingsService } from './settings/settings.service';
import { Speaker } from '@libs/types/telegram';
import { Ollama } from 'ollama';

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

  @OnEvent(`start-conversation`, { async: true })
  private async startConversation(): Promise<void> {

  }

  @OnEvent(`break-conversation`, { async: true })
  private async breakConversation(): Promise<void> {

  }

  @OnEvent(`pause-conversation`, { async: true })
  private async pauseConversation(): Promise<void> {

  }

  @OnEvent(`resume-conversation`, { async: true })
  private async resumeConversation(): Promise<void> {

  }



}

import { Controller, Get, Logger } from '@nestjs/common';
import { AiConversationV3Service } from './ai_conversation_v3.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SettingsService } from './settings/settings.service';
import { Speaker } from '@libs/types/telegram';

@Controller()
export class AiConversationV3Controller {

  private readonly logger: Logger = new Logger(`Speaker`);
  private lastResponder: Speaker = null;

  constructor(
    private readonly aiConversationV3Service: AiConversationV3Service,
    private readonly settings: SettingsService,
  ) { }

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

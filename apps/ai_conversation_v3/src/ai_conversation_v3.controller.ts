import { Controller, Get, Logger, Post } from '@nestjs/common';
import { ConversationService } from './ai_conversation_v3.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SettingsService } from './settings/settings.service';
import { Speaker } from '@libs/types/telegram';

@Controller()
export class ConversationController {


  private readonly logger: Logger = new Logger(`Speaker`);
  private lastResponder: Speaker = null;

  constructor(
    private readonly aiConversationV3Service: ConversationService,
    private readonly settings: SettingsService,
  ) { }

  @Post()
  @Get()
  public async initializeConversation(): Promise<void> {

  }

}

import { Controller, Get } from '@nestjs/common';
import { AiConversationV3Service } from './ai_conversation_v3.service';

@Controller()
export class AiConversationV3Controller {
  constructor(private readonly aiConversationV3Service: AiConversationV3Service) {}

  @Get()
  getHello(): string {
    return this.aiConversationV3Service.getHello();
  }
}

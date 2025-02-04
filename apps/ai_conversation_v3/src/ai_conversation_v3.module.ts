import { Module } from '@nestjs/common';
import { AiConversationV3Controller } from './ai_conversation_v3.controller';
import { AiConversationV3Service } from './ai_conversation_v3.service';

@Module({
  imports: [],
  controllers: [AiConversationV3Controller],
  providers: [AiConversationV3Service],
})
export class AiConversationV3Module {}

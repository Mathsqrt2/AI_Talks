import { Module } from '@nestjs/common';
import { AiConversationV3Controller } from './ai_conversation_v3.controller';
import { AiConversationV3Service } from './ai_conversation_v3.service';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    SettingsModule,
  ],
  controllers: [
    AiConversationV3Controller
  ],
  providers: [
    AiConversationV3Service
  ],
})
export class AiConversationV3Module { }

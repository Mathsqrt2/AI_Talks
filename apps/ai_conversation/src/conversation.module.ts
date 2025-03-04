import { ConversationController } from './controllers/conversation.controller';
import { SettingsController } from './controllers/settings.controller';
import { ConversationService } from './conversation.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramModule } from '@libs/telegram';
import { SettingsModule } from '@libs/settings';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';
import { AiModule } from '@libs/ai';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    SettingsModule,
    TelegramModule,
    LoggerModule,
    AiModule,
  ],
  controllers: [
    ConversationController,
    SettingsController,
  ],
  providers: [
    ConversationService,
  ],
})

export class AiConversationV3Module { }

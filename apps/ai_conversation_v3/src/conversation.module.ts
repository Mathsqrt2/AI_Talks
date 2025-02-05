import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { SettingsModule } from './settings/settings.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    SettingsModule,
  ],
  controllers: [
    ConversationController,
  ],
  providers: [
    ConversationService,
  ],
})
export class AiConversationV3Module { }

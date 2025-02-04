import { BOT_MESSAGES, USER_MESSAGES } from './ai_conversation_v3.constants';
import { ConversationController } from './ai_conversation_v3.controller';
import { ConversationService } from './ai_conversation_v3.service';
import { SettingsModule } from './settings/settings.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    BullModule.forRootAsync({
      useFactory: async () => ({
        connection: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        }
      })
    }),
    BullModule.registerQueue({
      name: USER_MESSAGES,
    }),
    BullModule.registerQueue({
      name: BOT_MESSAGES
    }),
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

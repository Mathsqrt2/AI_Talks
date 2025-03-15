import { ConversationController } from './controllers/conversation.controller';
import { SettingsController } from './controllers/settings.controller';
import { ConversationService } from './conversation.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramModule } from '@libs/telegram';
import { SettingsModule } from '@libs/settings';
import { ConfigModule } from '@nestjs/config';
import { Logger, LoggerModule } from '@libs/logger';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AiModule } from '@libs/ai';
import { DatabaseModule } from '@libs/database';
import { LogMessage } from './constants/conversation.responses';

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

export class AiConversationV3Module implements OnApplicationBootstrap {

  constructor(
    private readonly logger: Logger
  ) { }

  public onApplicationBootstrap() {
    this.logger.log(LogMessage.log.onApplicationBootstrap(), { context: AiConversationV3Module.name })
  }
}
